#!/usr/bin/env node

/**
 * WASM 构建脚本
 * 自动检查并安装 wasm-pack，然后构建 WASM 模块
 */

import { spawn, execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const wasmDir = join(rootDir, 'wasm');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color + args.join(' ') + colors.reset);
}

function logInfo(...args) {
  log(colors.blue, '[INFO]', ...args);
}

function logSuccess(...args) {
  log(colors.green, '[SUCCESS]', ...args);
}

function logError(...args) {
  log(colors.red, '[ERROR]', ...args);
}

function logWarn(...args) {
  log(colors.yellow, '[WARN]', ...args);
}

// 检查命令是否存在
function commandExists(cmd) {
  try {
    const isWindows = platform() === 'win32';
    if (isWindows) {
      // Windows 使用 where
      execSync(`where ${cmd}`, { stdio: 'ignore' });
    } else {
      // Unix 使用 which
      execSync(`which ${cmd}`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

// 运行命令并返回 Promise
function runCommand(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: options.cwd || rootDir,
      env: { ...process.env },
      ...options,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// 检查 wasm-pack 是否已安装
function checkWasmPack() {
  return commandExists('wasm-pack');
}

// 安装 wasm-pack
async function installWasmPack() {
  logInfo('wasm-pack not found, installing...');

  try {
    // 使用 cargo 安装 wasm-pack
    if (commandExists('cargo')) {
      logInfo('Installing wasm-pack via cargo...');
      await runCommand('cargo', ['install', 'wasm-pack']);
      logSuccess('wasm-pack installed successfully via cargo');
      return true;
    } else {
      logError('Cargo not found. Please install Rust toolchain first:');
      logError('  https://www.rust-lang.org/tools/install');
      return false;
    }
  } catch (err) {
    logError('Failed to install wasm-pack:', err.message);
    return false;
  }
}

// 构建 WASM 模块
async function buildWasm(dev = false) {
  const mode = dev ? 'dev' : 'release';
  logInfo(`Building WASM module in ${mode} mode...`);

  try {
    const args = ['build', '--target', 'web', '--out-name', 'index'];
    if (!dev) {
      args.push('--release');
    }

    await runCommand('wasm-pack', args, { cwd: wasmDir });
    logSuccess('WASM module built successfully');
    return true;
  } catch (err) {
    logError('Failed to build WASM module:', err.message);
    return false;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const optional = args.includes('--optional');
  const dev = args.includes('--dev');

  logInfo('WASM build script started...');
  logInfo('Optional mode:', optional || false);
  logInfo('Build mode:', dev ? 'dev' : 'release');

  // 检查 wasm 目录是否存在
  if (!existsSync(wasmDir)) {
    logWarn('WASM directory not found, skipping WASM build');
    return;
  }

  // 检查 wasm-pack
  let hasWasmPack = checkWasmPack();

  if (!hasWasmPack) {
    if (optional) {
      logWarn('wasm-pack not found, skipping WASM build (optional mode)');
      logWarn('WASM acceleration will not be available');
      logWarn('To enable WASM acceleration, install Rust toolchain and wasm-pack:');
      logWarn('  1. Install Rust: https://www.rust-lang.org/tools/install');
      logWarn('  2. Run: npm run build:wasm');
      return;
    }

    const installed = await installWasmPack();
    if (!installed) {
      logError('Failed to install wasm-pack');
      if (optional) {
        logWarn('Continuing without WASM support...');
        return;
      }
      process.exit(1);
    }
    hasWasmPack = true;
  }

  if (hasWasmPack) {
    logSuccess('wasm-pack found:', execSync('wasm-pack --version').toString().trim());

    // 构建 WASM 模块
    const success = await buildWasm(dev);

    if (!success) {
      if (optional) {
        logWarn('WASM build failed, continuing without WASM support...');
        return;
      }
      process.exit(1);
    }

    // 复制 WASM 文件到 public 目录
    const pkgDir = join(wasmDir, 'pkg');
    if (existsSync(pkgDir)) {
      logInfo('WASM files ready in wasm/pkg/');
    }
  }

  logSuccess('WASM build completed!');
}

// 运行
main().catch((err) => {
  logError('Fatal error:', err);
  process.exit(1);
});
