/**
 * WASM 兼容层 - 提供与现有 JavaScript API 兼容的接口
 * 根据 WASM 是否可用自动选择实现
 */

import * as jsImpl from "./filters";
import * as jsEnergy from "./energy";
import * as jsGrid from "./grid";
import { getWasmModule, ensureWasmLoaded, sampleModeToWasm } from "./wasmApi";
import type { SampleMode } from "./types";

/**
 * 高斯核生成 - WASM 版本
 */
export async function gaussianKernel1d(sigma: number): Promise<Float32Array> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.gaussian_kernel_1d(sigma);
  }
  return jsImpl.gaussianKernel1d(sigma);
}

/**
 * 可分离卷积 - WASM 版本
 */
export async function convolveSeparable(
  src: Float32Array,
  width: number,
  height: number,
  k: Float32Array
): Promise<Float32Array> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.convolve_separable(src, width, height, k);
  }
  return jsImpl.convolveSeparable(src, width, height, k);
}

/**
 * Sobel 边缘检测 - WASM 版本
 */
export async function sobel(
  src: Float32Array,
  width: number,
  height: number
): Promise<{ gx: Float32Array; gy: Float32Array }> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.sobel(src, width, height);
  }
  return jsImpl.sobel(src, width, height);
}

/**
 * RGBA 转灰度图 - WASM 版本
 */
export async function rgbaToGray01(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Promise<Float32Array> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.rgba_to_gray01(rgba, width, height);
  }
  return jsEnergy.rgbaToGray01(rgba, width, height);
}

/**
 * 梯度能量计算 - WASM 版本
 */
export async function gradEnergy(
  gray01: Float32Array,
  width: number,
  height: number,
  sigma: number
): Promise<Float32Array> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.grad_energy(gray01, width, height, sigma);
  }
  return jsEnergy.gradEnergy(gray01, width, height, sigma);
}

/**
 * 方向性能量增强 - WASM 版本
 */
export async function enhanceEnergyDirectional(
  energy: Float32Array,
  width: number,
  height: number,
  horizontalFactor: number,
  verticalFactor: number
): Promise<Float32Array> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.enhance_energy_directional(energy, width, height, horizontalFactor, verticalFactor);
  }
  return jsEnergy.enhanceEnergyDirectional(energy, width, height, horizontalFactor, verticalFactor);
}

/**
 * 能量图转热力图 - WASM 版本
 */
export async function toHeatmapU8(energy: Float32Array): Promise<Uint8Array> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.to_heatmap_u8(energy);
  }
  return jsEnergy.toHeatmapU8(energy);
}

/**
 * 像素大小检测 - WASM 版本
 */
export async function detectPixelSize(
  energyU8: Uint8Array,
  width: number,
  height: number,
  minS: number,
  maxS: number
): Promise<number> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.detect_pixel_size(energyU8, width, height, minS, maxS);
  }
  return jsGrid.detectPixelSize(energyU8, width, height, minS, maxS);
}

/**
 * 网格线检测 - WASM 版本
 */
export async function detectGridLines(
  energyU8: Uint8Array,
  width: number,
  height: number,
  gapSize: number,
  gapTolerance: number,
  minEnergy: number,
  smoothWin: number,
  windowSize: number
): Promise<{ xLines: number[]; yLines: number[] }> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.detect_grid_lines(energyU8, width, height, gapSize, gapTolerance, minEnergy, smoothWin, windowSize);
  }
  return jsGrid.detectGridLines(energyU8, width, height, gapSize, gapTolerance, minEnergy, smoothWin, windowSize);
}

/**
 * 网格线插值 - WASM 版本
 */
export async function interpolateLines(
  lines: number[],
  limit: number,
  fallbackGap: number
): Promise<number[]> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.interpolate_lines(lines, limit, fallbackGap);
  }
  return jsGrid.interpolateLines(lines, limit, fallbackGap);
}

/**
 * 完善边缘 - WASM 版本
 */
export async function completeEdges(
  allLines: number[],
  limit: number,
  typicalGap: number,
  gapTolerance: number
): Promise<number[]> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    return wasm.complete_edges(allLines, limit, typicalGap, gapTolerance);
  }
  return jsGrid.completeEdges(allLines, limit, typicalGap, gapTolerance);
}

/**
 * 直接像素采样 - WASM 版本
 */
export async function samplePixelArtDirect(
  rgb: Uint8ClampedArray,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,
  nativeRes: boolean
): Promise<{ outW: number; outH: number; outRgb: Uint8Array; outRgba: Uint8Array }> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    const wasmMode = sampleModeToWasm(mode);
    const result = wasm.sample_pixel_art_direct(
      rgb,
      width,
      height,
      targetWidth,
      targetHeight,
      wasmMode,
      weightRatio,
      upscaleFactor,
      nativeRes
    );
    return {
      outW: result.outW,
      outH: result.outH,
      outRgb: result.outRgb,
      outRgba: result.outRgba
    };
  }
  return jsGrid.samplePixelArtDirect(rgb, width, height, targetWidth, targetHeight, mode, weightRatio, upscaleFactor, nativeRes);
}

/**
 * 基于网格的像素采样 - WASM 版本
 */
export async function samplePixelArt(
  rgb: Uint8ClampedArray,
  width: number,
  height: number,
  allX: number[],
  allY: number[],
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,
  nativeRes: boolean
): Promise<{ outW: number; outH: number; outRgb: Uint8Array; outRgba: Uint8Array }> {
  const wasm = await ensureWasmLoaded();
  if (wasm) {
    const wasmMode = sampleModeToWasm(mode);
    const result = wasm.sample_pixel_art(rgb, width, height, allX, allY, wasmMode, weightRatio, upscaleFactor, nativeRes);
    return {
      outW: result.outW,
      outH: result.outH,
      outRgb: result.outRgb,
      outRgba: result.outRgba
    };
  }
  return jsGrid.samplePixelArt(rgb, width, height, allX, allY, mode, weightRatio, upscaleFactor, nativeRes);
}
