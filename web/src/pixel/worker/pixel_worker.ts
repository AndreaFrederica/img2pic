import * as Comlink from "comlink";
import type { PipelineParams, PipelineResult, RgbaImage } from "../types";

// 优先使用 WASM 加速版本，回退到 JavaScript 版本
import {
  rgbaToGray01 as rgbaToGray01Wasm,
  gradEnergy as gradEnergyWasm,
  enhanceEnergyDirectional as enhanceEnergyDirectionalWasm,
  toHeatmapU8 as toHeatmapU8Wasm,
  detectPixelSize as detectPixelSizeWasm,
  detectGridLines as detectGridLinesWasm,
  interpolateLines as interpolateLinesWasm,
  completeEdges as completeEdgesWasm,
  samplePixelArt as samplePixelArtWasm,
  samplePixelArtDirect as samplePixelArtDirectWasm,
} from "../wasmCompat";

// JavaScript 回退实现
import {
  rgbaToGray01 as rgbaToGray01Js,
  gradEnergy as gradEnergyJs,
  enhanceEnergyDirectional as enhanceEnergyDirectionalJs,
  toHeatmapU8 as toHeatmapU8Js,
} from "../energy";
import {
  detectPixelSize as detectPixelSizeJs,
  detectGridLines as detectGridLinesJs,
  interpolateLines as interpolateLinesJs,
  completeEdges as completeEdgesJs,
  samplePixelArt as samplePixelArtJs,
  samplePixelArtDirect as samplePixelArtDirectJs,
} from "../grid";

// 检查 WASM 是否可用并选择合适的实现
// 如果 WASM 模块未启用或加载失败，自动回退到 JavaScript
async function withWasmFallback<T>(
  wasmFn: () => Promise<T>,
  jsFn: () => T | Promise<T>
): Promise<T> {
  try {
    const result = await wasmFn();
    return result;
  } catch {
    // WASM 不可用，使用 JavaScript 版本
    return jsFn();
  }
}

async function runPipeline(img: RgbaImage, params: PipelineParams): Promise<PipelineResult> {
  console.log('Worker: runPipeline started', { width: img.width, height: img.height, params });

  const width = img.width;
  const height = img.height;
  const rgba = new Uint8ClampedArray(img.rgba);

  let energyU8: Uint8Array;
  let pixelSize = 0;
  let xLines: number[] = [];
  let yLines: number[] = [];
  let allX: number[] = [];
  let allY: number[] = [];

  // 检查是否是直接采样模式
  if (params.sampleMode === "direct") {
    // 直接采样模式，不需要能量图和网格检测
    console.log('Worker: using direct sampling mode');
    energyU8 = new Uint8Array(width * height);
  } else {
    // 原有的基于能量图的流程
    // 1) energy - 使用 WASM 或 JS 实现
    const gray = await withWasmFallback(
      () => rgbaToGray01Wasm(rgba, width, height),
      () => rgbaToGray01Js(rgba, width, height)
    );

    let energy = await withWasmFallback(
      () => gradEnergyWasm(gray, width, height, params.sigma),
      () => gradEnergyJs(gray, width, height, params.sigma)
    );

    if (params.enhanceEnergy) {
      const hFactor = params.enhanceDirectional ? params.enhanceHorizontal : 1.5;
      const vFactor = params.enhanceDirectional ? params.enhanceVertical : 1.5;

      energy = await withWasmFallback(
        () => enhanceEnergyDirectionalWasm(energy, width, height, hFactor, vFactor),
        () => enhanceEnergyDirectionalJs(energy, width, height, hFactor, vFactor)
      );
    }

    energyU8 = await withWasmFallback(
      () => toHeatmapU8Wasm(energy),
      () => toHeatmapU8Js(energy)
    );

    // 2) pixel size detect (if needed)
    pixelSize = params.pixelSize || 0;
    if (pixelSize <= 0) {
      pixelSize = await withWasmFallback(
        () => detectPixelSizeWasm(energyU8, width, height, params.minS, params.maxS),
        () => detectPixelSizeJs(energyU8, width, height, params.minS, params.maxS)
      );
    }
    console.log('Worker: detected pixelSize:', pixelSize);

    // 3) grid detect
    const gridResult = await withWasmFallback(
      () => detectGridLinesWasm(
        energyU8,
        width,
        height,
        pixelSize,
        params.gapTolerance,
        params.minEnergy,
        params.smooth,
        params.windowSize
      ),
      () => detectGridLinesJs(
        energyU8,
        width,
        height,
        pixelSize,
        params.gapTolerance,
        params.minEnergy,
        params.smooth,
        params.windowSize
      )
    );
    xLines = gridResult.xLines;
    yLines = gridResult.yLines;
    console.log('Worker: grid lines detected', { xLines: xLines.length, yLines: yLines.length });

    // 4) interpolate + complete edges
    const allX0 = await withWasmFallback(
      () => interpolateLinesWasm(xLines, width, pixelSize),
      () => interpolateLinesJs(xLines, width, pixelSize)
    );
    const allY0 = await withWasmFallback(
      () => interpolateLinesWasm(yLines, height, pixelSize),
      () => interpolateLinesJs(yLines, height, pixelSize)
    );

    // Calculate typical gaps
    let typicalX = pixelSize;
    if (allX0.length > 1) {
      let sum = 0;
      for (let i = 1; i < allX0.length; i++) {
        const curr = allX0[i]!;
        const prev = allX0[i-1]!;
        sum += curr - prev;
      }
      typicalX = Math.round(sum / (allX0.length - 1));
    }

    let typicalY = pixelSize;
    if (allY0.length > 1) {
      let sum = 0;
      for (let i = 1; i < allY0.length; i++) {
        const curr = allY0[i]!;
        const prev = allY0[i-1]!;
        sum += curr - prev;
      }
      typicalY = Math.round(sum / (allY0.length - 1));
    }

    allX = await withWasmFallback(
      () => completeEdgesWasm(allX0, width, typicalX, params.gapTolerance),
      () => completeEdgesJs(allX0, width, typicalX, params.gapTolerance)
    );
    allY = await withWasmFallback(
      () => completeEdgesWasm(allY0, height, typicalY, params.gapTolerance),
      () => completeEdgesJs(allY0, height, typicalY, params.gapTolerance)
    );
  }

  // 5) pixel art (optional)
  let pixelArt: PipelineResult["pixelArt"] = undefined;
  if (params.sample) {
    let upscaleFactor: number;
    if (params.upscale > 0) upscaleFactor = params.upscale;
    else if (params.nativeRes) upscaleFactor = 1;
    else upscaleFactor = pixelSize || 1;

    const nativeRes = upscaleFactor === 1;

    if (params.sampleMode === "direct") {
      // 使用直接采样，根据像素大小计算目标尺寸
      const pixelSize = params.pixelSize || 8; // 直接采样模式必须手动设置像素大小
      const targetWidth = Math.floor(width / pixelSize);
      const targetHeight = Math.floor(height / pixelSize);

      console.log('Worker: direct sampling', { pixelSize, targetWidth, targetHeight });

      const { outW, outH, outRgb, outRgba } = await withWasmFallback(
        () => samplePixelArtDirectWasm(
          rgba,
          width,
          height,
          targetWidth,
          targetHeight,
          params.sampleMode,
          params.sampleWeightRatio,
          upscaleFactor,
          nativeRes
        ),
        () => samplePixelArtDirectJs(
          rgba,
          width,
          height,
          targetWidth,
          targetHeight,
          params.sampleMode,
          params.sampleWeightRatio,
          upscaleFactor,
          nativeRes
        )
      );

      pixelArt = {
        width: outW,
        height: outH,
        rgb: outRgb.buffer.slice(0) as ArrayBuffer,
        rgba: outRgba ? outRgba.buffer.slice(0) as ArrayBuffer : undefined,
        upscaleFactor,
      };
    } else {
      // 使用基于网格的采样
      const { outW, outH, outRgb, outRgba } = await withWasmFallback(
        () => samplePixelArtWasm(
          rgba,
          width,
          height,
          allX,
          allY,
          params.sampleMode,
          params.sampleWeightRatio,
          upscaleFactor,
          nativeRes
        ),
        () => samplePixelArtJs(
          rgba,
          width,
          height,
          allX,
          allY,
          params.sampleMode,
          params.sampleWeightRatio,
          upscaleFactor,
          nativeRes
        )
      );

      pixelArt = {
        width: outW,
        height: outH,
        rgb: outRgb.buffer.slice(0) as ArrayBuffer,
        rgba: outRgba ? outRgba.buffer.slice(0) as ArrayBuffer : undefined,
        upscaleFactor,
      };
    }
  }

  const res: PipelineResult = {
    width,
    height,
    detectedPixelSize: pixelSize,
    energyU8: energyU8.buffer.slice(0) as ArrayBuffer,
    xLines,
    yLines,
    allXLines: allX,
    allYLines: allY,
    pixelArt,
  };

  // transfer 大 buffer
  const transfers: Transferable[] = [res.energyU8];
  if (res.pixelArt) {
    transfers.push(res.pixelArt.rgb);
    if (res.pixelArt.rgba) transfers.push(res.pixelArt.rgba);
  }

  console.log('Worker: returning result', {
    width: res.width,
    height: res.height,
    detectedPixelSize: res.detectedPixelSize,
    xLines: res.xLines.length,
    yLines: res.yLines.length,
    hasPixelArt: !!res.pixelArt
  });

  return Comlink.transfer(res, transfers);
}

Comlink.expose({ runPipeline });
export type PixelWorkerApi = { runPipeline: typeof runPipeline };
