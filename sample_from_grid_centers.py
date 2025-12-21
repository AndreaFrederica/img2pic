#!/usr/bin/env python
"""
Sample colors from original image at grid cell centers.
Based on energy map detection + grid interpolation + center point sampling.
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
import cv2


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Sample colors from original image at grid cell centers."
    )
    p.add_argument("--in", dest="input_path", required=True, help="Input image path.")
    p.add_argument("--out", dest="output_path", help="Output path. Default: out/<name>_sampled.png")
    
    # energy generation
    p.add_argument("--sigma", type=float, default=1.0, help="Gaussian blur sigma before gradients.")
    
    # grid detection
    p.add_argument("--gap-size", type=int, default=8, help="Expected gap size (pixels) between grid lines.")
    p.add_argument("--gap-tolerance", type=int, default=2, help="Tolerance around gap size (±pixels).")
    p.add_argument("--min-energy", type=float, default=0.15, help="Minimum energy threshold (0~1 of max).")
    p.add_argument("--smooth", type=int, default=3, help="Smoothing window size for 1D profiles.")
    
    # sampling mode
    p.add_argument("--mode", type=str, default="center", choices=["center", "average", "weighted"],
                  help="Sampling mode: center=point color, average=cell average, weighted=weighted average around center.")
    p.add_argument("--weight-ratio", type=float, default=0.6, help="Weight ratio for weighted mode (0.1-0.9).")
    
    # visualization
    p.add_argument("--show-grid", action="store_true", help="Show grid lines in output.")
    p.add_argument("--grid-color", type=str, default="gray", help="Grid line color.")
    p.add_argument("--pixel-size", type=int, default=1, help="Size of each sampled pixel in output.")
    
    return p.parse_args()


def _resolve_output_path(input_path: Path, output_path: str | None) -> Path:
    if output_path:
        return Path(output_path)
    return Path("out") / f"{input_path.stem}_sampled.png"


def _grad_energy(gray_u8: np.ndarray, sigma: float) -> np.ndarray:
    """Compute gradient energy map."""
    g = gray_u8.astype(np.float32) / 255.0
    if sigma > 0:
        g = cv2.GaussianBlur(g, ksize=(0, 0), sigmaX=sigma, sigmaY=sigma)
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    return np.abs(gx) + np.abs(gy)


def _to_u8_heatmap(e: np.ndarray) -> np.ndarray:
    """Convert energy map to uint8 heatmap."""
    v = e.astype(np.float32)
    v = v / (np.quantile(v, 0.99) + 1e-6)
    v = np.clip(v, 0, 1)
    return (v * 255).astype(np.uint8)


def _detect_peaks_1d(profile: np.ndarray, gap_size: int, gap_tolerance: int, min_threshold: float) -> list[int]:
    """Detect peaks in 1D profile."""
    if profile.max() == 0:
        return []
    
    threshold = min_threshold * profile.max()
    peaks = []
    for i in range(1, len(profile) - 1):
        if (profile[i] > profile[i-1] and 
            profile[i] > profile[i+1] and 
            profile[i] >= threshold):
            peaks.append(i)
    
    if not peaks:
        return []
    
    # Filter peaks by spacing
    filtered_peaks = [peaks[0]]
    for p in peaks[1:]:
        last = filtered_peaks[-1]
        spacing = p - last
        
        if abs(spacing - gap_size) <= gap_tolerance:
            filtered_peaks.append(p)
        elif spacing > gap_size + gap_tolerance:
            filtered_peaks.append(p)
    
    return filtered_peaks


def _detect_grid_lines(energy_map: np.ndarray,
                       gap_size: int,
                       gap_tolerance: int,
                       min_energy: float,
                       smooth: int) -> tuple[list[int], list[int]]:
    """Detect grid lines from energy map."""
    h, w = energy_map.shape[:2]
    
    if energy_map.ndim == 3:
        energy_gray = cv2.cvtColor(energy_map, cv2.COLOR_RGB2GRAY).astype(np.float32)
    else:
        energy_gray = energy_map.astype(np.float32)
    
    # 1D profiles
    x_profile = energy_gray.sum(axis=0)
    y_profile = energy_gray.sum(axis=1)
    
    # Smooth
    if smooth > 1:
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (smooth, smooth))
        x_profile = cv2.filter2D(x_profile, -1, kernel[:, 0])
        y_profile = cv2.filter2D(y_profile, -1, kernel[0, :])
    
    # Detect peaks
    x_lines = _detect_peaks_1d(x_profile, gap_size, gap_tolerance, min_energy)
    y_lines = _detect_peaks_1d(y_profile, gap_size, gap_tolerance, min_energy)
    
    return x_lines, y_lines


def _get_all_grid_lines(lines: list[int], limit: int) -> list[int]:
    """Get all grid lines including interpolated ones."""
    if not lines:
        return []
    
    # Estimate typical gap
    if len(lines) > 1:
        gaps = [lines[i+1] - lines[i] for i in range(len(lines)-1)]
        typical_gap = int(np.median(gaps))
    else:
        typical_gap = 8
    
    all_lines = list(lines)
    
    # Interpolate at beginning
    if lines[0] > typical_gap:
        num_before = max(1, round(lines[0] / typical_gap) - 1)
        for k in range(1, num_before + 1):
            interp_pos = int(k * lines[0] / (num_before + 1))
            all_lines.append(interp_pos)
    
    # Interpolate in gaps
    for i in range(len(lines) - 1):
        pos1 = lines[i]
        pos2 = lines[i + 1]
        gap = pos2 - pos1
        
        if gap > typical_gap * 1.5:
            num_missing = max(1, round(gap / typical_gap) - 1)
            for k in range(1, num_missing + 1):
                interp_pos = pos1 + int(k * gap / (num_missing + 1))
                all_lines.append(interp_pos)
    
    # Interpolate at end
    if lines[-1] < limit - typical_gap:
        num_after = max(1, round((limit - lines[-1]) / typical_gap) - 1)
        for k in range(1, num_after + 1):
            interp_pos = lines[-1] + int(k * (limit - lines[-1]) / (num_after + 1))
            all_lines.append(interp_pos)
    
    return sorted(set(all_lines))


def _sample_at_centers(original_rgb: np.ndarray,
                       all_x_lines: list[int],
                       all_y_lines: list[int],
                       mode: str = "center",
                       weight_ratio: float = 0.6,
                       pixel_size: int = 1) -> np.ndarray:
    """Sample colors at grid cell centers and create pixel art."""
    h, w = original_rgb.shape[:2]
    
    # Create output image (pixel art size = number of cells)
    cell_width = len(all_x_lines) - 1
    cell_height = len(all_y_lines) - 1
    
    output = np.zeros((cell_height * pixel_size, cell_width * pixel_size, 3), dtype=np.uint8)
    
    # For each cell, sample color and draw pixel
    for i in range(len(all_x_lines) - 1):
        x1 = all_x_lines[i]
        x2 = all_x_lines[i + 1]
        cx = (x1 + x2) // 2
        
        for j in range(len(all_y_lines) - 1):
            y1 = all_y_lines[j]
            y2 = all_y_lines[j + 1]
            cy = (y1 + y2) // 2
            
            # Sample color based on mode
            if mode == "center":
                # Sample at center point
                color = original_rgb[cy, cx]
            elif mode == "average":
                # Average of entire cell
                cell = original_rgb[y1:y2, x1:x2]
                color = np.mean(cell, axis=(0, 1)).astype(np.uint8)
            elif mode == "weighted":
                # Weighted average around center
                cell_width = x2 - x1
                cell_height = y2 - y1
                
                # Define weighted region around center
                weight_width = int(cell_width * weight_ratio)
                weight_height = int(cell_height * weight_ratio)
                
                wx1 = max(0, cx - weight_width // 2)
                wx2 = min(w, cx + weight_width // 2)
                wy1 = max(0, cy - weight_height // 2)
                wy2 = min(h, cy + weight_height // 2)
                
                weighted_region = original_rgb[wy1:wy2, wx1:wx2]
                color = np.mean(weighted_region, axis=(0, 1)).astype(np.uint8)
            else:
                color = original_rgb[cy, cx]
            
            # Draw pixel in output image (pixel art coordinates)
            out_x = i * pixel_size
            out_y = j * pixel_size
            
            output[out_y:out_y + pixel_size, out_x:out_x + pixel_size] = color
    
    return output


def _draw_grid_lines(image: np.ndarray,
                     all_x_lines: list[int],
                     all_y_lines: list[int],
                     pixel_size: int = 1,
                     color: str = "gray",
                     line_width: int = 1) -> np.ndarray:
    """Draw grid lines on pixel art image."""
    # Convert to RGB if grayscale
    if image.ndim == 2:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    else:
        image_rgb = image.copy()
    
    # Color mapping
    color_map = {
        "red": (255, 0, 0),
        "green": (0, 255, 0),
        "blue": (0, 0, 255),
        "yellow": (255, 255, 0),
        "cyan": (0, 255, 255),
        "magenta": (255, 0, 255),
        "gray": (128, 128, 128),
        "white": (255, 255, 255),
        "black": (0, 0, 0),
    }
    line_color = color_map.get(color.lower(), (128, 128, 128))
    
    h, w = image_rgb.shape[:2]
    
    # Draw vertical lines (between pixels)
    for i in range(len(all_x_lines) - 1):
        x = i * pixel_size + pixel_size - 1
        if 0 <= x < w:
            image_rgb = cv2.line(image_rgb, (x, 0), (x, h-1), line_color, line_width)
    
    # Draw horizontal lines (between pixels)
    for j in range(len(all_y_lines) - 1):
        y = j * pixel_size + pixel_size - 1
        if 0 <= y < h:
            image_rgb = cv2.line(image_rgb, (0, y), (w-1, y), line_color, line_width)
    
    return image_rgb


def main() -> None:
    args = _parse_args()
    input_path = Path(args.input_path)
    if not input_path.exists():
        raise SystemExit(f"Input not found: {input_path}")
    
    output_path = _resolve_output_path(input_path, args.output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Load image
    original_rgb = np.array(Image.open(input_path).convert("RGB"))
    gray = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2GRAY)
    
    print(f"Image: {input_path}")
    print(f"Size: {original_rgb.shape[1]}x{original_rgb.shape[0]}")
    
    # Generate energy
    energy = _grad_energy(gray, sigma=float(args.sigma))
    energy_u8 = _to_u8_heatmap(energy)
    
    print(f"Energy range: [{energy.min():.4f}, {energy.max():.4f}]")
    
    # Detect grid lines
    x_lines, y_lines = _detect_grid_lines(
        energy_map=energy_u8,
        gap_size=int(args.gap_size),
        gap_tolerance=int(args.gap_tolerance),
        min_energy=float(args.min_energy),
        smooth=int(args.smooth)
    )
    
    print(f"Detected X lines: {len(x_lines)}")
    print(f"Detected Y lines: {len(y_lines)}")
    
    # Get all lines (with interpolation)
    h, w = original_rgb.shape[:2]
    all_x_lines = _get_all_grid_lines(x_lines, w)
    all_y_lines = _get_all_grid_lines(y_lines, h)
    
    print(f"All X lines (with interpolation): {len(all_x_lines)}")
    print(f"All Y lines (with interpolation): {len(all_y_lines)}")
    print(f"Grid cells: {(len(all_x_lines) - 1) * (len(all_y_lines) - 1)}")
    
    # Sample at centers
    sampled = _sample_at_centers(
        original_rgb=original_rgb,
        all_x_lines=all_x_lines,
        all_y_lines=all_y_lines,
        mode=args.mode,
        weight_ratio=float(args.weight_ratio),
        pixel_size=int(args.pixel_size)
    )
    
    # Add grid lines if requested
    if args.show_grid:
        sampled = _draw_grid_lines(
            image=sampled,
            all_x_lines=all_x_lines,
            all_y_lines=all_y_lines,
            pixel_size=int(args.pixel_size),
            color=args.grid_color,
            line_width=1
        )
    
    # Save result
    Image.fromarray(sampled).save(output_path)
    print(f"Saved: {output_path}")
    print(f"Sampling mode: {args.mode}")
    if args.mode == "weighted":
        print(f"Weight ratio: {args.weight_ratio}")
    print(f"Pixel size: {args.pixel_size}px")


if __name__ == "__main__":
    main()