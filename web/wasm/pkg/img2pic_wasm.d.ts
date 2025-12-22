/* tslint:disable */
/* eslint-disable */

/**
 * 完善边缘（确保覆盖整个图像）
 */
export function complete_edges(all_lines: Uint32Array, limit: number, typical_gap: number, gap_tolerance: number): Uint32Array;

/**
 * 完善边缘 - JSON 版本
 */
export function complete_edges_json(params_json: string): string;

/**
 * 可分离卷积 (先水平后垂直)
 */
export function convolve_separable(src: Float32Array, width: number, height: number, k: Float32Array): Float32Array;

/**
 * 检测网格线
 */
export function detect_grid_lines(energy_u8: Uint8Array, width: number, height: number, gap_size: number, gap_tolerance: number, min_energy: number, smooth_win: number, window_size: number): any;

/**
 * 网格线检测 - JSON 版本
 */
export function detect_grid_lines_json(params_json: string): string;

/**
 * 1D 峰值检测
 */
export function detect_peaks_1d(profile: Float32Array, gap_size: number, gap_tolerance: number, min_threshold_ratio: number, window_size: number): Uint32Array;

/**
 * 检测像素大小（通过自相关分析）
 */
export function detect_pixel_size(energy_u8: Uint8Array, width: number, height: number, min_s: number, max_s: number): number;

/**
 * 像素大小检测 - JSON 版本
 */
export function detect_pixel_size_json(params_json: string): string;

/**
 * 方向性能量增强
 * 增强/削弱水平或垂直边缘
 */
export function enhance_energy_directional(energy: Float32Array, width: number, height: number, horizontal_factor: number, vertical_factor: number): Float32Array;

/**
 * 方向性能量增强 - JSON 版本
 */
export function enhance_energy_directional_json(params_json: string): string;

/**
 * 生成 1D 高斯核
 */
export function gaussian_kernel_1d(sigma: number): Float32Array;

/**
 * 计算梯度能量图
 * 先用高斯模糊（可选），再用 Sobel 算子计算梯度
 */
export function grad_energy(gray01: Float32Array, width: number, height: number, sigma: number): Float32Array;

/**
 * 梯度能量计算 - JSON 版本
 */
export function grad_energy_json(params_json: string): string;

export function init(): void;

/**
 * 插值缺失的网格线
 */
export function interpolate_lines(lines: Uint32Array, limit: number, fallback_gap: number, interp_threshold: number): Uint32Array;

/**
 * 线条插值 - JSON 版本
 */
export function interpolate_lines_json(params_json: string): string;

/**
 * 近似分位数计算（采样避免全排序）
 */
export function quantile_approx(x: Float32Array, q: number): number;

/**
 * RGBA 转 0-1 范围的灰度图
 * 使用标准亮度系数: 0.299*R + 0.587*G + 0.114*B
 */
export function rgba_to_gray01(rgba: Uint8Array, width: number, height: number): Float32Array;

/**
 * RGBA 转灰度图 - JSON 版本
 */
export function rgba_to_gray01_json(params_json: string): string;

/**
 * 基于网格的像素采样
 */
export function sample_pixel_art(rgb: Uint8Array, width: number, height: number, all_x: Uint32Array, all_y: Uint32Array, mode: number, weight_ratio: number, upscale_factor: number, native_res: boolean): any;

/**
 * 直接比例采样（无需网格检测）
 */
export function sample_pixel_art_direct(rgb: Uint8Array, width: number, height: number, target_width: number, target_height: number, mode: number, weight_ratio: number, upscale_factor: number, native_res: boolean): any;

/**
 * 直接像素采样 - JSON 版本
 */
export function sample_pixel_art_direct_json(params_json: string): string;

/**
 * 基于网格的像素采样 - JSON 版本
 */
export function sample_pixel_art_json(params_json: string): string;

/**
 * Sobel 边缘检测算子
 * 返回 (gx, gy) 两个梯度图
 */
export function sobel(src: Float32Array, width: number, height: number): any;

/**
 * 将能量图转换为 8 位灰度图（热力图）
 */
export function to_heatmap_u8(energy: Float32Array): Uint8Array;

/**
 * 能量图转热力图 - JSON 版本
 */
export function to_heatmap_u8_json(params_json: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly complete_edges: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly complete_edges_json: (a: number, b: number) => [number, number];
  readonly convolve_separable: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly detect_grid_lines: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => any;
  readonly detect_grid_lines_json: (a: number, b: number) => [number, number];
  readonly detect_peaks_1d: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly detect_pixel_size: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly detect_pixel_size_json: (a: number, b: number) => [number, number];
  readonly enhance_energy_directional: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly enhance_energy_directional_json: (a: number, b: number) => [number, number];
  readonly gaussian_kernel_1d: (a: number) => [number, number];
  readonly grad_energy: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly grad_energy_json: (a: number, b: number) => [number, number];
  readonly init: () => void;
  readonly interpolate_lines: (a: number, b: number, c: number, d: number) => [number, number];
  readonly interpolate_lines_json: (a: number, b: number) => [number, number];
  readonly quantile_approx: (a: number, b: number, c: number) => number;
  readonly rgba_to_gray01: (a: number, b: number, c: number, d: number) => [number, number];
  readonly rgba_to_gray01_json: (a: number, b: number) => [number, number];
  readonly sample_pixel_art: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => any;
  readonly sample_pixel_art_direct: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => any;
  readonly sample_pixel_art_direct_json: (a: number, b: number) => [number, number];
  readonly sample_pixel_art_json: (a: number, b: number) => [number, number];
  readonly sobel: (a: number, b: number, c: number, d: number) => any;
  readonly to_heatmap_u8: (a: number, b: number) => [number, number];
  readonly to_heatmap_u8_json: (a: number, b: number) => [number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
