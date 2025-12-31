import torch
import numpy as np
from PIL import Image

def _image_to_pil(image):
    # image: ComfyUI IMAGE -> torch.Tensor [B,H,W,C] float 0..1
    if isinstance(image, torch.Tensor):
        t = image
        if t.ndim == 4:
            t = t[0]
        t = t.detach().cpu()
        arr = (t.clamp(0, 1) * 255).to(torch.uint8).numpy()  # ✅ 不用 astype
    else:
        arr = image
        if arr.ndim == 4:
            arr = arr[0]
        arr = np.clip(arr, 0, 1)
        arr = (arr * 255).astype(np.uint8)
    return Image.fromarray(arr, mode="RGB")

from .backend import (
    _to_numpy_image, _energy_map,
    detect_grid_from_energy,
    render_energy_image, render_debug_overlay,
    pixelize_by_grid, quantize_pil
)

def _pil_to_tensor(img_rgb: Image.Image):
    arr = np.array(img_rgb).astype(np.float32) / 255.0  # HWC
    return torch.from_numpy(arr[None, ...])  # [1,H,W,C]

class Img2PicEnergyPixelize:
    """
    输出三张图：
    1) 纯能量图
    2) 能量图 + 网格线(红=检测, 蓝=插值) + 绿中心点
    3) 像素化结果（可选量化）
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),

                # energy
                "min_energy": ("FLOAT", {"default": 0.15, "min": 0.0, "max": 1.0, "step": 0.01}),
                "smooth_window": ("INT", {"default": 9, "min": 1, "max": 51, "step": 2}),
                "gap_tolerance": ("INT", {"default": 2, "min": 0, "max": 10, "step": 1}),
                "peak_min_dist": ("INT", {"default": 2, "min": 1, "max": 32, "step": 1}),

                # sampling
                "sample_mode": (["center", "average", "weighted"], {"default": "center"}),
                "weight_ratio": ("FLOAT", {"default": 0.6, "min": 0.0, "max": 1.0, "step": 0.05}),

                # quantize
                "enable_quantize": ("BOOLEAN", {"default": False}),
                "quantize_mode": (["smart", "force"], {"default": "smart"}),
                "colors": ("INT", {"default": 32, "min": 2, "max": 256, "step": 1}),
                "similarity_threshold": ("FLOAT", {"default": 0.9, "min": 0.0, "max": 1.0, "step": 0.01}),
            }
        }

    RETURN_TYPES = ("IMAGE", "IMAGE", "IMAGE")
    RETURN_NAMES = ("energy_only", "energy_grid_debug", "pixelized")
    FUNCTION = "run"
    CATEGORY = "PixelArt/Img2Pic"

    def run(
        self,
        image,
        min_energy,
        smooth_window,
        gap_tolerance,
        peak_min_dist,
        sample_mode,
        weight_ratio,
        enable_quantize,
        quantize_mode,
        colors,
        similarity_threshold,
    ):
        # to numpy rgb
        pil = _image_to_pil(image)
        rgb = np.array(pil)  # HWC uint8



        # energy
        gray = np.array(pil.convert("L"), dtype=np.float32) / 255.0
        energy = _energy_map(gray)

        # grid detect
        grid = detect_grid_from_energy(
            energy,
            min_energy=float(min_energy),
            window=int(smooth_window),
            gap_tol=int(gap_tolerance),
            min_dist=int(peak_min_dist),
        )

        energy_img = render_energy_image(energy)
        debug_img = render_debug_overlay(energy_img, grid)

        # pixelize
        pix = pixelize_by_grid(pil, grid, mode=sample_mode, weight_ratio=float(weight_ratio))

        # quantize (optional)
        if enable_quantize:
            pix = quantize_pil(
                pix,
                mode=quantize_mode,
                colors=int(colors),
                similarity_threshold=float(similarity_threshold),
            )

        return (_pil_to_tensor(energy_img),
                _pil_to_tensor(debug_img),
                _pil_to_tensor(pix))
