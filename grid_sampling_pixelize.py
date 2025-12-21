#!/usr/bin/env python
from __future__ import annotations

import argparse
from pathlib import Path
import numpy as np
from PIL import Image
import cv2
from scipy.signal import find_peaks
from scipy.stats import mode


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert AI 'pixel-style' image into true pixel art by detecting pixel grid edges and sampling center points.",
    )
    parser.add_argument(
        "--in",
        dest="input_path",
        required=True,
        help="Input image path.",
    )
    parser.add_argument(
        "--out",
        dest="output_path",
        help="Output image path. Defaults to out/<name>_grid_pixel.png.",
    )
    parser.add_argument(
        "--edge-threshold",
        type=float,
        default=0.05,
        help="Edge detection threshold (0.0-1.0). Lower = more edges detected.",
    )
    parser.add_argument(
        "--peak-prominence",
        type=float,
        default=0.1,
        help="Minimum prominence of grid peaks (0.0-1.0).",
    )
    parser.add_argument(
        "--min-distance",
        type=int,
        default=5,
        help="Minimum distance between grid lines in pixels.",
    )
    parser.add_argument(
        "--upscale",
        type=int,
        default=1,
        help="Upscale factor after pixelizing (1 = keep original pixel size).",
    )
    parser.add_argument(
        "--colors",
        type=int,
        default=256,
        help="Palette size for quantization (lower = more retro).",
    )
    parser.add_argument(
        "--no-quant",
        action="store_true",
        help="Skip palette quantization.",
    )
    parser.add_argument(
        "--color-threshold",
        type=float,
        default=0.0,
        help="Color similarity threshold (0.0-1.0). Higher = more aggressive color merging. 0 = disabled.",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Save debug images showing detected grid and sampling points.",
    )
    return parser.parse_args()


def _resolve_output_path(input_path: Path, output_path: str | None, suffix: str = "_grid_pixel") -> Path:
    if output_path:
        return Path(output_path)
    return Path("out") / f"{input_path.stem}{suffix}.png"


def enhance_edges(image: np.ndarray) -> np.ndarray:
    """增强边缘检测效果"""
    # 转换为灰度
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    # 使用多个方向和尺度的边缘检测
    edges_combined = np.zeros_like(gray, dtype=float)

    # 尝试不同的核大小
    for ksize in [3, 5, 7]:
        # Sobel边缘检测
        sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=ksize)
        sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=ksize)

        # 计算梯度幅值
        sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)

        # 拉普拉斯边缘检测（检测零交叉）
        laplacian = cv2.Laplacian(gray, cv2.CV_64F, ksize=ksize)
        laplacian = np.abs(laplacian)

        # Canny边缘检测
        canny = cv2.Canny(gray, 50, 150)

        # 组合所有边缘
        edges_combined += sobel_magnitude + laplacian + canny

    # 归一化
    edges_combined = edges_combined / edges_combined.max()

    return edges_combined


def find_grid_lines(edges_2d: np.ndarray, threshold: float,
                   peak_prominence: float, min_distance: int, axis: int) -> np.ndarray:
    """在一维边缘投影中找到网格线位置"""
    # 投影到指定轴
    projection = np.mean(edges_2d, axis=axis)

    # 平滑处理
    window_size = min_distance
    if window_size > 1:
        kernel = np.ones(window_size) / window_size
        projection = np.convolve(projection, kernel, mode='same')

    # 应用阈值
    projection = projection * (projection > threshold * projection.max())

    # 找峰值
    peaks, properties = find_peaks(
        projection,
        distance=min_distance,
        prominence=peak_prominence * projection.max()
    )

    # 添加边界
    grid_lines = np.concatenate([[0], peaks, [edges_2d.shape[axis]]])

    return np.sort(grid_lines)


def create_regular_grid_from_irregular(grid_lines: np.ndarray, image_size: int) -> np.ndarray:
    """从不规则的网格线创建规律的网格，填充整个图像"""
    # 计算网格间距
    spacings = np.diff(grid_lines)

    # 找到最常见的间距（众数）
    if len(spacings) > 0:
        common_spacing = mode(spacings, keepdims=True).mode[0]
    else:
        common_spacing = 8  # 默认值

    # 创建从0开始覆盖整个图像的规律网格
    regular_grid = np.arange(0, image_size, common_spacing)

    # 确保包含边界
    if regular_grid[-1] < image_size:
        regular_grid = np.append(regular_grid, image_size)

    return regular_grid.astype(int)


def merge_similar_colors(image: np.ndarray, threshold: float) -> np.ndarray:
    """合并相似的颜色"""
    if threshold <= 0.0:
        return image  # 不进行颜色合并

    # 将图像重塑为颜色列表
    height, width = image.shape[:2]
    pixels = image.reshape(-1, 3)

    # 创建唯一颜色映射
    unique_colors = {}
    merged_pixels = pixels.copy()

    # 对每个像素，找到最接近的已存在的颜色或创建新颜色
    for i, pixel in enumerate(pixels):
        # 检查是否与已存在的颜色足够相似
        found_similar = False
        pixel_float = pixel.astype(float) / 255.0

        for ref_color_key in unique_colors:
            ref_color = np.array(ref_color_key.split(','), dtype=float)
            # 计算颜色距离（使用欧氏距离）
            distance = np.linalg.norm(pixel_float - ref_color)

            if distance <= threshold:
                # 使用参考颜色
                merged_pixels[i] = (ref_color * 255).astype(np.uint8)
                found_similar = True
                break

        if not found_similar:
            # 添加为新颜色
            color_key = f"{pixel_float[0]:.3f},{pixel_float[1]:.3f},{pixel_float[2]:.3f}"
            unique_colors[color_key] = True

    # 重塑回图像形状
    return merged_pixels.reshape(height, width, 3)


def sample_grid_centers(image: np.ndarray, h_lines: np.ndarray, v_lines: np.ndarray) -> np.ndarray:
    """在每个网格中心采样颜色值"""
    h_centers = (h_lines[:-1] + h_lines[1:]) // 2
    v_centers = (v_lines[:-1] + v_lines[1:]) // 2

    # 创建像素化图像
    pixelated = np.zeros((len(h_centers), len(v_centers), 3), dtype=np.uint8)

    for i, h_center in enumerate(h_centers):
        for j, v_center in enumerate(v_centers):
            # 确保中心点在图像范围内
            h_center = min(h_center, image.shape[0] - 1)
            v_center = min(v_center, image.shape[1] - 1)

            # 直接采样中心点
            pixelated[i, j] = image[h_center, v_center].astype(np.uint8)

    return pixelated


def detect_and_sample_grid(image: Image.Image, edge_threshold: float,
                          peak_prominence: float, min_distance: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """检测网格并采样中心点"""
    # 转换为numpy数组
    img_array = np.array(image)
    height, width = img_array.shape[:2]

    # 增强边缘
    edges = enhance_edges(img_array)

    # 找到水平和垂直网格线
    h_lines = find_grid_lines(edges, edge_threshold, peak_prominence, min_distance, axis=1)
    v_lines = find_grid_lines(edges, edge_threshold, peak_prominence, min_distance, axis=0)

    # 转换为规律网格（保持大致的网格密度）
    h_regular = create_regular_grid_from_irregular(h_lines, height)
    v_regular = create_regular_grid_from_irregular(v_lines, width)

    # 采样网格中心
    pixelated = sample_grid_centers(img_array, h_regular, v_regular)

    return pixelated, h_regular, v_regular


def main() -> None:
    args = _parse_args()
    input_path = Path(args.input_path)
    if not input_path.exists():
        raise SystemExit(f"Input not found: {input_path}")

    output_path = _resolve_output_path(input_path, args.output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 打开图像
    image = Image.open(input_path).convert("RGB")

    print(f"Original image size: {image.width} x {image.height}")

    # 检测网格并采样
    pixelated, h_grid, v_grid = detect_and_sample_grid(
        image, args.edge_threshold, args.peak_prominence, args.min_distance
    )

    print(f"Detected grid: {len(v_grid)-1} x {len(h_grid)-1} pixels")

    # 颜色合并（如果启用）
    if args.color_threshold > 0.0:
        print(f"Merging similar colors with threshold: {args.color_threshold}")
        pixelated = merge_similar_colors(pixelated, args.color_threshold)

        # 统计颜色数量
        unique_colors = len(np.unique(pixelated.reshape(-1, 3), axis=0))
        print(f"Unique colors after merging: {unique_colors}")

    # 转换回PIL图像
    pixelated_img = Image.fromarray(pixelated)

    # 放大（如果需要）
    if args.upscale > 1:
        new_size = (pixelated_img.width * args.upscale, pixelated_img.height * args.upscale)
        pixelated_img = pixelated_img.resize(new_size, Image.Resampling.NEAREST)
        print(f"Upscaled to: {new_size[0]} x {new_size[1]}")

    # 颜色量化
    if not args.no_quant:
        pixelated_img = pixelated_img.quantize(colors=args.colors, method=Image.FASTOCTREE)
        pixelated_img = pixelated_img.convert("RGB")

    # 保存结果
    pixelated_img.save(output_path)
    print(f"Saved: {output_path}")

    # 保存调试图像
    if args.debug:
        # 保存网格可视化
        debug_path = output_path.parent / f"{input_path.stem}_grid_debug.png"
        img_array = np.array(image)
        debug_img = img_array.copy()

        # 绘制网格线（绿色）和采样点（红色）
        for line in h_grid:
            cv2.line(debug_img, (0, line), (debug_img.shape[1], line), (0, 255, 0), 1)
        for line in v_grid:
            cv2.line(debug_img, (line, 0), (line, debug_img.shape[0]), (0, 255, 0), 1)

        # 绘制采样点
        h_centers = (h_grid[:-1] + h_grid[1:]) // 2
        v_centers = (v_grid[:-1] + v_grid[1:]) // 2
        for h_center in h_centers:
            for v_center in v_centers:
                cv2.circle(debug_img, (v_center, h_center), 2, (255, 0, 0), -1)

        Image.fromarray(debug_img).save(debug_path)
        print(f"Debug image saved: {debug_path}")


if __name__ == "__main__":
    main()