import numpy as np
from PIL import Image, ImageDraw

def _to_numpy_image(image_bhwc):
    """
    image_bhwc: torch.Tensor or np.ndarray
    return: HWC uint8 numpy
    """
    if hasattr(image_bhwc, "detach"):   # torch.Tensor
        image_bhwc = image_bhwc.detach().cpu().numpy()

    if image_bhwc.ndim == 4:
        image_bhwc = image_bhwc[0]

    image_bhwc = np.clip(image_bhwc, 0.0, 1.0)
    img = (image_bhwc * 255.0).astype(np.uint8)
    return img

def ensure_numpy(x):
    import numpy as np
    import torch
    if isinstance(x, torch.Tensor):
        x = x.detach().cpu().numpy()
    return x

def _energy_map(gray_f32):
    """
    gray_f32: HxW in [0,1]
    Use Sobel-like gradients (no scipy).
    """
    # simple sobel kernels
    kx = np.array([[-1,0,1],[-2,0,2],[-1,0,1]], dtype=np.float32)
    ky = np.array([[-1,-2,-1],[0,0,0],[1,2,1]], dtype=np.float32)

    # pad
    g = np.pad(gray_f32, ((1,1),(1,1)), mode="edge")
    H, W = gray_f32.shape
    gx = np.zeros((H,W), dtype=np.float32)
    gy = np.zeros((H,W), dtype=np.float32)

    # 3x3 conv (still fast enough; can be vectorized later)
    for dy in range(3):
        for dx in range(3):
            w = kx[dy,dx]
            if w != 0:
                gx += w * g[dy:dy+H, dx:dx+W]
            w2 = ky[dy,dx]
            if w2 != 0:
                gy += w2 * g[dy:dy+H, dx:dx+W]

    e = np.sqrt(gx*gx + gy*gy)
    m = float(e.max())
    if m > 1e-8:
        e = e / m
    return e  # 0..1

def _smooth_1d(x, win):
    if win <= 1:
        return x
    k = np.ones(win, dtype=np.float32) / float(win)
    # same padding
    pad = win//2
    xp = np.pad(x, (pad, pad), mode="edge")
    y = np.convolve(xp, k, mode="valid")
    return y.astype(np.float32)

def _find_peaks_1d(x, min_prom=0.1, min_dist=2):
    """
    Simple peak finder: local maxima + threshold + distance suppression.
    """
    peaks = []
    N = len(x)
    for i in range(1, N-1):
        if x[i] >= x[i-1] and x[i] >= x[i+1] and x[i] >= min_prom:
            peaks.append(i)

    # distance suppression: keep higher peaks
    if not peaks:
        return []
    peaks_sorted = sorted(peaks, key=lambda i: x[i], reverse=True)
    keep = []
    blocked = np.zeros(N, dtype=bool)
    for p in peaks_sorted:
        if blocked[p]:
            continue
        keep.append(p)
        lo = max(0, p-min_dist)
        hi = min(N, p+min_dist+1)
        blocked[lo:hi] = True
    return sorted(keep)

def _dominant_gap(peaks, tol=2, min_gap=2, max_gap=128):
    """
    Find dominant spacing between peaks using histogram voting.
    """
    if len(peaks) < 2:
        return 0
    diffs = np.diff(np.array(peaks, dtype=np.int32))
    diffs = diffs[(diffs >= min_gap) & (diffs <= max_gap)]
    if diffs.size == 0:
        return 0

    # vote with tolerance: bin by rounded value
    hist = {}
    for d in diffs:
        key = int(d)
        hist[key] = hist.get(key, 0) + 1

    best = max(hist.items(), key=lambda kv: kv[1])[0]
    # refine: average near best within tol
    near = diffs[(diffs >= best-tol) & (diffs <= best+tol)]
    if near.size > 0:
        return int(round(float(near.mean())))
    return int(best)

def _interpolate_lines(peaks, gap, length, tol=2):
    """
    Given detected peaks and a dominant gap, generate a full line set.
    Mark original peaks as "detected", others as "interpolated".
    """
    if gap <= 0:
        return peaks, [], peaks[:]  # fallback

    peaks = sorted(set(peaks))
    if not peaks:
        # no peaks: just use regular grid starting at 0
        all_lines = list(range(0, length, gap))
        return [], all_lines, all_lines

    # pick an anchor: first peak
    anchor = peaks[0]
    # generate theoretical grid positions around anchor
    all_lines = []
    k0 = int(np.floor((0 - anchor) / gap))
    k1 = int(np.ceil((length - anchor) / gap))
    for k in range(k0, k1+1):
        pos = anchor + k*gap
        if 0 <= pos < length:
            all_lines.append(int(pos))
    all_lines = sorted(set(all_lines))

    detected = set(peaks)
    detected_lines = []
    interp_lines = []

    # match detected peaks to nearest theoretical line within tol
    used = set()
    for p in peaks:
        # nearest grid line
        nearest = min(all_lines, key=lambda a: abs(a - p))
        if abs(nearest - p) <= tol and nearest not in used:
            detected_lines.append(nearest)
            used.add(nearest)

    detected_set = set(detected_lines)
    for a in all_lines:
        if a not in detected_set:
            interp_lines.append(a)

    return detected_lines, interp_lines, all_lines

def detect_grid_from_energy(energy, min_energy=0.15, window=9, gap_tol=2, min_dist=2):
    """
    energy: HxW float 0..1
    Return lines/centers + debug info
    """
    H, W = energy.shape

    # threshold energy
    e = energy.copy()
    e[e < min_energy] = 0.0

    # projections
    proj_x = e.sum(axis=0).astype(np.float32)  # length W
    proj_y = e.sum(axis=1).astype(np.float32)  # length H

    # normalize
    if proj_x.max() > 1e-6: proj_x /= proj_x.max()
    if proj_y.max() > 1e-6: proj_y /= proj_y.max()

    # smooth
    proj_xs = _smooth_1d(proj_x, window)
    proj_ys = _smooth_1d(proj_y, window)

    # peaks
    x_peaks = _find_peaks_1d(proj_xs, min_prom=0.10, min_dist=min_dist)
    y_peaks = _find_peaks_1d(proj_ys, min_prom=0.10, min_dist=min_dist)

    # dominant gap
    gap_x = _dominant_gap(x_peaks, tol=gap_tol)
    gap_y = _dominant_gap(y_peaks, tol=gap_tol)
    gap = gap_x if gap_x > 0 else gap_y
    if gap <= 0:
        # fallback: try estimate from image size
        gap = max(2, min(W, H)//64)

    # interpolate full lines
    x_det, x_intp, x_all = _interpolate_lines(x_peaks, gap, W, tol=gap_tol)
    y_det, y_intp, y_all = _interpolate_lines(y_peaks, gap, H, tol=gap_tol)

    # centers
    centers = []
    for i in range(len(x_all)-1):
        for j in range(len(y_all)-1):
            cx = (x_all[i] + x_all[i+1]) // 2
            cy = (y_all[j] + y_all[j+1]) // 2
            if 0 <= cx < W and 0 <= cy < H:
                centers.append((cx, cy))

    return {
        "gap": int(gap),
        "x_det": x_det, "y_det": y_det,
        "x_intp": x_intp, "y_intp": y_intp,
        "x_all": x_all, "y_all": y_all,
        "centers": centers
    }

def render_energy_image(energy):
    g = (energy.clip(0,1)*255).astype(np.uint8)
    return Image.fromarray(g, mode="L").convert("RGB")

def render_debug_overlay(energy_img_rgb, grid_info):
    img = energy_img_rgb.copy()
    draw = ImageDraw.Draw(img)
    W, H = img.size

    # detected lines (red)
    for x in grid_info["x_det"]:
        draw.line([x, 0, x, H], fill=(255,0,0), width=1)
    for y in grid_info["y_det"]:
        draw.line([0, y, W, y], fill=(255,0,0), width=1)

    # interpolated lines (blue)
    for x in grid_info["x_intp"]:
        draw.line([x, 0, x, H], fill=(0,128,255), width=1)
    for y in grid_info["y_intp"]:
        draw.line([0, y, W, y], fill=(0,128,255), width=1)

    # centers (green)
    for (cx, cy) in grid_info["centers"]:
        draw.rectangle([cx-1, cy-1, cx+1, cy+1], fill=(0,255,0))

    return img

def pixelize_by_grid(img_rgb, grid_info, mode="center", weight_ratio=0.6):
    arr = np.array(img_rgb).astype(np.float32)  # HWC
    H, W, _ = arr.shape
    x_all = grid_info["x_all"]
    y_all = grid_info["y_all"]

    out = np.zeros_like(arr)

    # precompute gaussian weights for "weighted"
    def weights(h, w, ratio):
        cy = (h-1)/2.0
        cx = (w-1)/2.0
        yy, xx = np.mgrid[0:h, 0:w]
        # ratio -> sigma
        sigma = max(0.5, min(h,w) * ratio * 0.35)
        ww = np.exp(-((yy-cy)**2 + (xx-cx)**2) / (2*sigma*sigma))
        s = ww.sum()
        if s > 1e-6:
            ww /= s
        return ww.astype(np.float32)

    for yi in range(len(y_all)-1):
        y0, y1 = y_all[yi], y_all[yi+1]
        if y1 <= y0: continue
        for xi in range(len(x_all)-1):
            x0, x1 = x_all[xi], x_all[xi+1]
            if x1 <= x0: continue
            block = arr[y0:y1, x0:x1, :]  # bh,bw,3

            if mode == "average":
                color = block.mean(axis=(0,1))
            elif mode == "weighted":
                h, w = block.shape[0], block.shape[1]
                ww = weights(h, w, weight_ratio)
                color = (block * ww[..., None]).sum(axis=(0,1))
            else:  # center
                cy = (y0+y1)//2
                cx = (x0+x1)//2
                color = arr[min(cy,H-1), min(cx,W-1), :]

            out[y0:y1, x0:x1, :] = color

    out_u8 = out.clip(0,255).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")

def quantize_pil(img_rgb, mode="smart", colors=32, similarity_threshold=0.9):
    """
    Minimal quantize:
    - force: PIL median-cut to exact colors
    - smart: PIL adaptive then merge close colors
    """
    if colors <= 0:
        colors = 32

    if mode == "force":
        q = img_rgb.quantize(colors=colors, method=Image.MEDIANCUT)
        return q.convert("RGB")

    # smart: adaptive then merge close palette colors
    q = img_rgb.quantize(colors=colors, method=Image.FASTOCTREE)
    pal = q.getpalette()[:colors*3]
    pal = np.array(pal, dtype=np.float32).reshape(-1,3)

    # merge palette colors by similarity_threshold (0..1)
    # convert threshold to rgb distance
    # similarity 1.0 -> dist 0, similarity 0.0 -> dist ~441
    max_dist = 441.67295593
    dist_th = (1.0 - float(similarity_threshold)) * max_dist

    parent = np.arange(len(pal), dtype=np.int32)

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for i in range(len(pal)):
        for j in range(i+1, len(pal)):
            d = np.linalg.norm(pal[i]-pal[j])
            if d <= dist_th:
                ri, rj = find(i), find(j)
                if ri != rj:
                    parent[rj] = ri

    # compute merged colors
    groups = {}
    for i in range(len(pal)):
        r = find(i)
        groups.setdefault(r, []).append(i)

    merged = pal.copy()
    for r, idxs in groups.items():
        merged_color = pal[idxs].mean(axis=0)
        for k in idxs:
            merged[k] = merged_color

    # apply merged palette
    # rebuild palette list
    merged_u8 = merged.clip(0,255).astype(np.uint8).reshape(-1).tolist()
    q2 = q.copy()
    q2.putpalette(merged_u8 + [0]*(768-len(merged_u8)))
    return q2.convert("RGB")
