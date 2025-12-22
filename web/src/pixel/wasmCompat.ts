/**
 * WASM 兼容层 - 提供与现有 JavaScript API 兼容的接口
 * 根据 WASM 是否可用且启用自动选择实现
 *
 * 注意：WASM 仅在主线程中工作
 * 使用 bundler 目标编译，更好地与 Vite 集成
 */

import * as jsImpl from "./filters";
import * as jsEnergy from "./energy";
import * as jsGrid from "./grid";
import { ensureWasmLoaded, sampleModeToWasm, isWasmEnabled } from "./wasmApi";
import type { SampleMode } from "./types";
import type { WasmModule } from "./wasmApi";

/**
 * 获取 WASM 模块（如果启用且可用）
 */
async function getWasmIfEnabled(): Promise<WasmModule | null> {
  if (!isWasmEnabled()) {
    return null;
  }
  return await ensureWasmLoaded();
}

/**
 * 高斯核生成 - WASM 版本
 */
export async function gaussianKernel1d(sigma: number): Promise<Float32Array> {
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for gaussianKernel1d');
    return wasm.gaussian_kernel_1d(sigma);
  }
  console.log('[Render] Using JS engine for gaussianKernel1d');
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for convolveSeparable');
    return wasm.convolve_separable(src, width, height, k);
  }
  console.log('[Render] Using JS engine for convolveSeparable');
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for sobel');
    return wasm.sobel(src, width, height);
  }
  console.log('[Render] Using JS engine for sobel');
  return jsImpl.sobel(src, width, height);
}

/**
 * RGBA 转灰度图 - WASM 版本
 */
export async function rgbaToGray01(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number
): Promise<Float32Array> {
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for rgbaToGray01', {
      rgbaLength: rgba.length,
      width,
      height,
      rgbaConstructor: rgba.constructor.name
    });
    // 确保使用 Uint8Array（WASM 可能不兼容 Uint8ClampedArray）
    const uint8Rgba = rgba instanceof Uint8ClampedArray ? new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.byteLength) : rgba;
    return wasm.rgba_to_gray01(uint8Rgba, width, height);
  }
  console.log('[Render] Using JS engine for rgbaToGray01');
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for gradEnergy');
    return wasm.grad_energy(gray01, width, height, sigma);
  }
  console.log('[Render] Using JS engine for gradEnergy');
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for enhanceEnergyDirectional');
    return wasm.enhance_energy_directional(energy, width, height, horizontalFactor, verticalFactor);
  }
  console.log('[Render] Using JS engine for enhanceEnergyDirectional');
  return jsEnergy.enhanceEnergyDirectional(energy, width, height, horizontalFactor, verticalFactor);
}

/**
 * 能量图转热力图 - WASM 版本
 */
export async function toHeatmapU8(energy: Float32Array): Promise<Uint8Array> {
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for toHeatmapU8');
    return wasm.to_heatmap_u8(energy);
  }
  console.log('[Render] Using JS engine for toHeatmapU8');
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for detectPixelSize', {
      energyU8Length: energyU8.length,
      width,
      height,
      minS,
      maxS
    });
    return wasm.detect_pixel_size(energyU8, width, height, minS, maxS);
  }
  console.log('[Render] Using JS engine for detectPixelSize');
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for detectGridLines');
    return wasm.detect_grid_lines(energyU8, width, height, gapSize, gapTolerance, minEnergy, smoothWin, windowSize);
  }
  console.log('[Render] Using JS engine for detectGridLines');
  return jsGrid.detectGridLines(energyU8, width, height, gapSize, gapTolerance, minEnergy, smoothWin, windowSize);
}

/**
 * 网格线插值 - WASM 版本
 */
export async function interpolateLines(
  lines: number[],
  limit: number,
  fallbackGap: number,
  interpThreshold: number = 1.5
): Promise<number[]> {
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for interpolateLines');
    // 转换 number[] 为 Uint32Array（WASM 需要）
    const linesUint32 = new Uint32Array(lines);
    const result = wasm.interpolate_lines(linesUint32, limit, fallbackGap, interpThreshold);
    // 转换回 number[] 以匹配 API
    return Array.from(result);
  }
  console.log('[Render] Using JS engine for interpolateLines');
  return jsGrid.interpolateLines(lines, limit, fallbackGap, interpThreshold);
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
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for completeEdges');
    // 转换 number[] 为 Uint32Array（WASM 需要）
    const linesUint32 = new Uint32Array(allLines);
    const result = wasm.complete_edges(linesUint32, limit, typicalGap, gapTolerance);
    // 转换回 number[] 以匹配 API
    return Array.from(result);
  }
  console.log('[Render] Using JS engine for completeEdges');
  return jsGrid.completeEdges(allLines, limit, typicalGap, gapTolerance);
}

/**
 * 直接像素采样 - WASM 版本
 */
export async function samplePixelArtDirect(
  rgb: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,
  nativeRes: boolean
): Promise<{ outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array }> {
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for samplePixelArtDirect');
    // 确保使用 Uint8Array
    const uint8Rgb = rgb instanceof Uint8ClampedArray ? new Uint8Array(rgb.buffer, rgb.byteOffset, rgb.byteLength) : rgb;
    const wasmMode = sampleModeToWasm(mode);
    const result = wasm.sample_pixel_art_direct(
      uint8Rgb,
      width,
      height,
      targetWidth,
      targetHeight,
      wasmMode,
      weightRatio,
      upscaleFactor,
      nativeRes
    );
    const ret: { outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array } = {
      outW: result.outW,
      outH: result.outH,
      outRgb: result.outRgb,
    };
    if (result.outRgba !== undefined) {
      ret.outRgba = result.outRgba;
    }
    return ret;
  }
  console.log('[Render] Using JS engine for samplePixelArtDirect');
  return jsGrid.samplePixelArtDirect(rgb, width, height, targetWidth, targetHeight, mode, weightRatio, upscaleFactor, nativeRes);
}

/**
 * 基于网格的像素采样 - WASM 版本
 */
export async function samplePixelArt(
  rgb: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  allX: number[],
  allY: number[],
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,
  nativeRes: boolean
): Promise<{ outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array }> {
  const wasm = await getWasmIfEnabled();
  if (wasm) {
    console.log('[Render] Using WASM engine for samplePixelArt');
    // 确保使用 Uint8Array
    const uint8Rgb = rgb instanceof Uint8ClampedArray ? new Uint8Array(rgb.buffer, rgb.byteOffset, rgb.byteLength) : rgb;
    // 转换 number[] 为 Uint32Array（WASM 需要）
    const allXUint32 = new Uint32Array(allX);
    const allYUint32 = new Uint32Array(allY);
    const wasmMode = sampleModeToWasm(mode);
    const result = wasm.sample_pixel_art(uint8Rgb, width, height, allXUint32, allYUint32, wasmMode, weightRatio, upscaleFactor, nativeRes);
    const ret: { outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array } = {
      outW: result.outW,
      outH: result.outH,
      outRgb: result.outRgb,
    };
    if (result.outRgba !== undefined) {
      ret.outRgba = result.outRgba;
    }
    return ret;
  }
  console.log('[Render] Using JS engine for samplePixelArt');
  return jsGrid.samplePixelArt(rgb, width, height, allX, allY, mode, weightRatio, upscaleFactor, nativeRes);
}
