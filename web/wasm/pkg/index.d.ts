/* tslint:disable */
/* eslint-disable */

/**
 * 完善边缘（确保覆盖整个图像）
 */
export function complete_edges(all_lines: Uint32Array, limit: number, typical_gap: number, gap_tolerance: number): Uint32Array;

/**
 * 可分离卷积 (先水平后垂直)
 */
export function convolve_separable(src: Float32Array, width: number, height: number, k: Float32Array): Float32Array;

/**
 * 检测网格线
 */
export function detect_grid_lines(energy_u8: Uint8Array, width: number, height: number, gap_size: number, gap_tolerance: number, min_energy: number, smooth_win: number, window_size: number): any;

/**
 * 1D 峰值检测
 */
export function detect_peaks_1d(profile: Float32Array, gap_size: number, gap_tolerance: number, min_threshold_ratio: number, window_size: number): Uint32Array;

/**
 * 检测像素大小（通过自相关分析）
 */
export function detect_pixel_size(energy_u8: Uint8Array, width: number, height: number, min_s: number, max_s: number): number;

/**
 * 方向性能量增强
 * 增强/削弱水平或垂直边缘
 */
export function enhance_energy_directional(energy: Float32Array, width: number, height: number, horizontal_factor: number, vertical_factor: number): Float32Array;

/**
 * 生成 1D 高斯核
 */
export function gaussian_kernel_1d(sigma: number): Float32Array;

/**
 * 计算梯度能量图
 * 先用高斯模糊（可选），再用 Sobel 算子计算梯度
 */
export function grad_energy(gray01: Float32Array, width: number, height: number, sigma: number): Float32Array;

export function init_panic_hook(): void;

/**
 * 插值缺失的网格线
 */
export function interpolate_lines(lines: Uint32Array, limit: number, fallback_gap: number, interp_threshold: number): Uint32Array;

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
 * 基于网格的像素采样
 */
export function sample_pixel_art(rgb: Uint8Array, width: number, height: number, all_x: Uint32Array, all_y: Uint32Array, mode: number, weight_ratio: number, upscale_factor: number, native_res: boolean): any;

/**
 * 直接比例采样（无需网格检测）
 */
export function sample_pixel_art_direct(rgb: Uint8Array, width: number, height: number, target_width: number, target_height: number, mode: number, weight_ratio: number, upscale_factor: number, native_res: boolean): any;

/**
 * Sobel 边缘检测算子
 * 返回 (gx, gy) 两个梯度图
 */
export function sobel(src: Float32Array, width: number, height: number): any;

/**
 * 将能量图转换为 8 位灰度图（热力图）
 */
export function to_heatmap_u8(energy: Float32Array): Uint8Array;
