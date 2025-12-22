@echo off
REM WASM 构建脚本 (Windows)

echo Building img2pic WASM module...

REM 使用 wasm-pack 构建
wasm-pack build --target web --out-name index --dev

echo WASM build completed!
echo Output: wasm\pkg\
