export type SampleMode = "center" | "average" | "weighted" | "direct";

export interface PipelineParams {
  // WASM 加速开关
  wasmEnabled: boolean;

  sigma: number;

  enhanceEnergy: boolean;
  enhanceDirectional: boolean;
  enhanceHorizontal: number;
  enhanceVertical: number;

  // grid
  gapTolerance: number;
  interpThreshold: number; // 插值线阈值，当间距大于 typical * interpThreshold 时插入插值线
  minEnergy: number;   // 0..1 * max(profile)
  smooth: number;      // 1D 平滑窗口
  windowSize: number;  // 0=auto

  // pixel size detect
  pixelSize: number;   // 0=auto
  minS: number;
  maxS: number;

  // sampling
  sample: boolean;
  sampleMode: SampleMode;
  sampleWeightRatio: number; // 0.1..0.9
  upscale: number;           // 0=use pixelSize; 1=native; >1 custom
  nativeRes: boolean;        // true => 1 pixel per cell
}

export interface RgbaImage {
  width: number;
  height: number;
  // Uint8ClampedArray 的 buffer；通过 transfer 传递
  rgba: ArrayBuffer;
}

export interface PixelArtResult {
  width: number;
  height: number;
  rgb: ArrayBuffer; // Uint8Array length = w*h*3
  rgba?: ArrayBuffer | undefined; // Uint8Array length = w*h*4 - 可选，用于支持透明度
  upscaleFactor: number;
}

export interface PipelineResult {
  width: number;
  height: number;

  detectedPixelSize: number;

  energyU8: ArrayBuffer; // Uint8Array length = w*h

  xLines: number[];
  yLines: number[];
  allXLines: number[];
  allYLines: number[];

  pixelArt?: PixelArtResult | undefined;
}
