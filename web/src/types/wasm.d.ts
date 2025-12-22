/**
 * WASM 模块类型声明
 * web 目标：default export 是 init 函数
 */

// Vite ?url import: 返回包含 URL 字符串的模块
declare module '@wasm/index_bg.wasm?url' {
  const url: string;
  export default url;
}

declare module '@wasm/index.js' {
  export interface WasmModule {
    gaussian_kernel_1d(sigma: number): Float32Array;
    convolve_separable(src: Float32Array, width: number, height: number, k: Float32Array): Float32Array;
    sobel(src: Float32Array, width: number, height: number): { gx: Float32Array; gy: Float32Array };
    quantile_approx(x: Float32Array, q: number): number;
    rgba_to_gray01(rgba: Uint8ClampedArray, width: number, height: number): Float32Array;
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
    ): number[];
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
    interpolate_lines(lines: number[], limit: number, fallback_gap: number, interp_threshold: number): number[];
    complete_edges(all_lines: number[], limit: number, typical_gap: number, gap_tolerance: number): number[];
    sample_pixel_art_direct(
      rgb: Uint8ClampedArray,
      width: number,
      height: number,
      target_width: number,
      target_height: number,
      mode: number,
      weight_ratio: number,
      upscale_factor: number,
      native_res: boolean
    ): { outW: number; outH: number; outRgb: Uint8Array; outRgba: Uint8Array };
    sample_pixel_art(
      rgb: Uint8ClampedArray,
      width: number,
      height: number,
      all_x: number[],
      all_y: number[],
      mode: number,
      weight_ratio: number,
      upscale_factor: number,
      native_res: boolean
    ): { outW: number; outH: number; outRgb: Uint8Array; outRgba: Uint8Array };
  }

  // web 目标：default export 是 init 函数
  export default function init(moduleOrUrl?: string | WebAssembly.Module): Promise<WasmModule>;
}
