/**
 * WASM 图像处理 API
 * 可选使用 WASM 加速图像计算
 */

import type { SampleMode } from "./types";

// WASM 模块接口定义（匹配实际 WASM 生成的类型）
export interface WasmModule {
  // 初始化 panic hook（用于更好的错误信息）
  init_panic_hook(): void;

  gaussian_kernel_1d(sigma: number): Float32Array;
  convolve_separable(src: Float32Array, width: number, height: number, k: Float32Array): Float32Array;
  sobel(src: Float32Array, width: number, height: number): { gx: Float32Array; gy: Float32Array };
  quantile_approx(x: Float32Array, q: number): number;
  rgba_to_gray01(rgba: Uint8Array, width: number, height: number): Float32Array;
  grad_energy(gray01: Float32Array, width: number, height: number, sigma: number): Float32Array;
  enhance_energy_directional(
    energy: Float32Array,
    width: number,
    height: number,
    horizontal_factor: number,
    vertical_factor: number
  ): Float32Array;
  to_heatmap_u8(energy: Float32Array): Uint8Array;
  detect_pixel_size(energy_u8: Uint8Array, width: number, height: number, min_s: number, max_s: number): number;
  detect_peaks_1d(
    profile: Float32Array,
    gap_size: number,
    gap_tolerance: number,
    min_threshold_ratio: number,
    window_size: number
  ): Uint32Array;
  detect_grid_lines(
    energy_u8: Uint8Array,
    width: number,
    height: number,
    gap_size: number,
    gap_tolerance: number,
    min_energy: number,
    smooth_win: number,
    window_size: number
  ): { xLines: number[]; yLines: number[] };
  interpolate_lines(lines: Uint32Array, limit: number, fallback_gap: number, interp_threshold: number): Uint32Array;
  complete_edges(all_lines: Uint32Array, limit: number, typical_gap: number, gap_tolerance: number): Uint32Array;
  sample_pixel_art_direct(
    rgb: Uint8Array,
    width: number,
    height: number,
    target_width: number,
    target_height: number,
    mode: number,
    weight_ratio: number,
    upscale_factor: number,
    native_res: boolean
  ): { outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array };
  sample_pixel_art(
    rgb: Uint8Array,
    width: number,
    height: number,
    all_x: Uint32Array,
    all_y: Uint32Array,
    mode: number,
    weight_ratio: number,
    upscale_factor: number,
    native_res: boolean
  ): { outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array };
}

// WASM 加载状态
type WasmLoadState = 'unloaded' | 'loading' | 'loaded' | 'error';

// WASM 模块实例
let wasmModule: WasmModule | null = null;
let wasmState: WasmLoadState = 'unloaded';
let wasmLoadPromise: Promise<WasmModule> | null = null;
let wasmError: Error | null = null;

// 用户设置：是否使用 WASM
let useWasmEnabled = false;

/**
 * 设置是否使用 WASM 加速
 * 注意：这只是偏好设置，不会释放已加载的 WASM 模块
 * 每个 JavaScript 上下文（主线程和 Worker）维护自己的 WASM 实例
 * @param enabled 是否启用 WASM
 */
export function setWasmEnabled(enabled: boolean): void {
  useWasmEnabled = enabled;
  // 不再释放模块 - 每个上下文维护自己的 WASM 实例
  // 这允许 Worker 独立加载和使用 WASM
}

/**
 * 获取是否启用了 WASM
 */
export function isWasmEnabled(): boolean {
  return useWasmEnabled;
}

/**
 * 获取 WASM 加载状态
 */
export function getWasmState(): WasmLoadState {
  return wasmState;
}

/**
 * 获取 WASM 加载错误（如果有）
 */
export function getWasmError(): Error | null {
  return wasmError;
}

/**
 * 加载 WASM 模块
 * bundler 目标：直接导入 JS 绑定，函数已自动初始化
 * 每个 JavaScript 上下文（主线程和 Worker）需要独立加载
 * @returns Promise<WasmModule>
 */
export async function loadWasmModule(): Promise<WasmModule> {
  // 如果已经加载，直接返回
  if (wasmModule) {
    console.log('[WASM] Module already loaded, reusing');
    return wasmModule;
  }

  // 如果正在加载，返回加载 Promise
  if (wasmLoadPromise) {
    console.log('[WASM] Already loading, waiting for existing promise');
    return wasmLoadPromise;
  }

  // 开始加载
  console.log('[WASM] Starting module load...');
  wasmState = 'loading';
  wasmLoadPromise = (async () => {
    try {
      // bundler 目标：直接导入，函数已自动初始化
      console.log('[WASM] Loading WASM JS bindings from @wasm/index.js');
      const wasmModuleImport = await import('@wasm/index.js');

      // bundler 目标直接导出所有函数，不需要 init()
      wasmModule = wasmModuleImport as unknown as WasmModule;

      // 手动初始化 panic hook（如果存在）
      try {
        if (typeof wasmModule.init_panic_hook === 'function') {
          wasmModule.init_panic_hook();
          console.log('[WASM] Panic hook initialized');
        }
      } catch {
        // init_panic_hook 可能不存在，忽略错误
        console.log('[WASM] init_panic_hook not available, skipping');
      }

      wasmState = 'loaded';
      wasmError = null;

      console.log('[WASM] Module loaded successfully');
      return wasmModule;
    } catch (err) {
      wasmError = err as Error;
      wasmState = 'error';
      console.error('[WASM] Failed to load module:', err);
      throw err;
    } finally {
      wasmLoadPromise = null;
    }
  })();

  return wasmLoadPromise;
}

/**
 * 检测浏览器是否支持 WASM
 */
export function isWasmSupported(): boolean {
  try {
    // 检测 WebAssembly 是否支持
    if (typeof WebAssembly === 'undefined') {
      return false;
    }

    // 检测是否支持 bulk memory 操作（用于性能优化）
    const supported = typeof WebAssembly.Memory === 'function';

    return supported;
  } catch {
    return false;
  }
}

/**
 * 获取 WASM 模块（如果已加载）
 */
export function getWasmModule(): WasmModule | null {
  return wasmModule;
}

/**
 * 确保 WASM 模块已加载
 * 注意：每个 JavaScript 上下文（主线程和 Worker）需要各自加载 WASM 实例
 * @returns Promise<WasmModule | null>
 */
export async function ensureWasmLoaded(): Promise<WasmModule | null> {
  if (!isWasmSupported()) {
    return null;
  }

  // 即使 useWasmEnabled 为 false，也尝试加载 WASM
  // 这允许 Worker 独立加载自己的 WASM 实例
  try {
    return await loadWasmModule();
  } catch (err) {
    console.error('[WASM] Failed to load:', err);
    return null;
  }
}

/**
 * 预加载 WASM 模块（可选）
 * 在用户需要之前提前加载，提升响应速度
 */
export async function preloadWasm(): Promise<boolean> {
  if (!isWasmSupported()) {
    return false;
  }

  try {
    await loadWasmModule();
    return true;
  } catch {
    return false;
  }
}

// 暴露 SampleMode 到 WASM 的映射
export function sampleModeToWasm(mode: SampleMode): number {
  switch (mode) {
    case 'direct':
      return 0;
    case 'center':
      return 1;
    case 'average':
      return 2;
    case 'weighted':
      return 3;
    default:
      return 0;
  }
}
