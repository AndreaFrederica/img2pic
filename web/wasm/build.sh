#!/bin/bash
# WASM 构建脚本

set -e

echo "Building img2pic WASM module..."

# 使用 wasm-pack 构建
wasm-pack build --target web --out-name index --dev

echo "WASM build completed!"
echo "Output: wasm/pkg/"
