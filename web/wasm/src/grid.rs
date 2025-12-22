use wasm_bindgen::prelude::*;
use std::collections::{HashSet, BTreeSet};

/// 边界反射处理（用于 1D 数组）
fn reflect_1d(i: i32, len: usize) -> usize {
    if i < 0 {
        (-i) as usize
    } else if i as usize >= len {
        let len = len as i32;
        (2 * len - 2 - i) as usize
    } else {
        i as usize
    }
}

/// 1D 去趋势（移除移动平均）
fn detrend_1d(x: &[f32], win: usize) -> Vec<f32> {
    let w = win.max(3) | 1; // 确保是奇数
    let half = w / 2;

    // 移动平均
    let mut sm = vec![0.0f32; x.len()];
    for i in 0..x.len() {
        let mut acc = 0.0f32;
        for t in -(half as i32)..=(half as i32) {
            let j = reflect_1d(i as i32 + t, x.len());
            acc += x[j];
        }
        sm[i] = acc / w as f32;
    }

    // 计算差异并去均值
    let mut mean = 0.0f32;
    let mut out = vec![0.0f32; x.len()];
    for i in 0..x.len() {
        out[i] = x[i] - sm[i];
        mean += out[i];
    }
    mean /= x.len() as f32;
    for v in out.iter_mut() {
        *v -= mean;
    }

    out
}

/// 自相关分数（归一化）
fn autocorr_score(x: &[f32], lag: usize) -> f32 {
    let n = x.len() - lag;
    if n <= 10 {
        return -1e9;
    }

    let mut dot = 0.0f32;
    let mut na = 0.0f32;
    let mut nb = 0.0f32;

    for i in 0..n {
        let a = x[i];
        let b = x[i + lag];
        dot += a * b;
        na += a * a;
        nb += b * b;
    }

    dot / ((na.sqrt() * nb.sqrt()) + 1e-9)
}

/// 检测像素大小（通过自相关分析）
#[wasm_bindgen]
pub fn detect_pixel_size(energy_u8: &[u8], width: usize, height: usize, min_s: usize, max_s: usize) -> usize {
    // 调试：记录接收到的参数
    web_sys::console::log_1(
        &format!("detect_pixel_size received: energy_u8.len()={}, width={}, height={}", energy_u8.len(), width, height).into()
    );

    // 验证输入数组长度
    let expected_len = width * height;
    if energy_u8.len() != expected_len {
        web_sys::console::error_1(
            &format!("detect_pixel_size: expected array length {}, got {}", expected_len, energy_u8.len()).into()
        );
        return min_s; // 返回默认值
    }

    // 投影
    let mut px = vec![0.0f32; width];
    let mut py = vec![0.0f32; height];

    for y in 0..height {
        let row = y * width;
        let mut row_sum = 0.0f32;
        for x in 0..width {
            let v = energy_u8[row + x] as f32;
            px[x] += v;
            row_sum += v;
        }
        py[y] = row_sum;
    }

    // 去趋势
    let win_x = (401_usize).min((31_usize).max((width / 10) | 1));
    let win_y = (401_usize).min((31_usize).max((height / 10) | 1));

    let px_dt = detrend_1d(&px, win_x);
    let py_dt = detrend_1d(&py, win_y);

    // 寻找最佳像素大小
    let mut best_s = min_s;
    let mut best = -1e9f32;

    for s in min_s..=max_s {
        let sx = autocorr_score(&px_dt, s);
        let sy = autocorr_score(&py_dt, s);
        let score = sx + sy;
        if score > best {
            best = score;
            best_s = s;
        }
    }

    best_s
}

/// 1D 盒式平滑
fn smooth_1d_box(x: &[f32], win: usize) -> Vec<f32> {
    let w = win.max(1);
    if w <= 1 {
        return x.to_vec();
    }

    let half = w / 2;
    let mut out = vec![0.0f32; x.len()];

    for i in 0..x.len() {
        let mut acc = 0.0f32;
        let mut cnt = 0_usize;
        for t in -(half as i32)..=(half as i32) {
            let j = i as i32 + t;
            if j >= 0 && (j as usize) < x.len() {
                acc += x[j as usize];
                cnt += 1;
            }
        }
        out[i] = acc / cnt as f32;
    }

    out
}

/// 1D 峰值检测
#[wasm_bindgen]
pub fn detect_peaks_1d(
    profile: &[f32],
    gap_size: usize,
    gap_tolerance: usize,
    min_threshold_ratio: f32,
    window_size: usize,
) -> Vec<usize> {
    let max_v = profile.iter().copied().fold(0.0f32, f32::max);
    if max_v <= 0.0 {
        return Vec::new();
    }

    let threshold = min_threshold_ratio * max_v;
    let w = 5_usize.max(window_size.max(gap_size));
    let step = (gap_size / 2).max(1);

    let mut detected = HashSet::new();

    let mut start = 0_usize;
    while start + w <= profile.len() {
        let end = start + w;
        let mut local_max = -1e18;
        let mut local_idx = 0_usize;

        for i in start..end {
            if profile[i] > local_max {
                local_max = profile[i];
                local_idx = i;
            }
        }

        if local_max >= threshold {
            // 检查是否是局部峰值
            let left_ok = local_idx == 0 || profile[local_idx] >= profile[local_idx - 1];
            let right_ok = local_idx == profile.len() - 1 || profile[local_idx] >= profile[local_idx + 1];

            if left_ok && right_ok {
                detected.insert(local_idx);
            }
        }

        start += step;
    }

    if detected.is_empty() {
        return Vec::new();
    }

    // 排序并精炼
    let mut peaks: Vec<usize> = detected.into_iter().collect();
    peaks.sort();

    let mut refined = Vec::new();
    let rad = (gap_size / 4).max(1);

    for &p in &peaks {
        let s = p.saturating_sub(rad);
        let e = (p + rad + 1).min(profile.len());

        let mut best = -1e18;
        let mut best_idx = p;

        for i in s..e {
            if profile[i] > best {
                best = profile[i];
                best_idx = i;
            }
        }

        refined.push(best_idx);
    }
    refined.sort();

    // 间距过滤
    let mut filtered = Vec::new();
    if !refined.is_empty() {
        filtered.push(refined[0]);
    }

    for i in 1..refined.len() {
        let p = refined[i];
        let last = *filtered.last().unwrap();
        let spacing = p - last;

        if (spacing as isize - gap_size as isize).abs() as usize <= gap_tolerance
            || spacing > gap_size + gap_tolerance
        {
            filtered.push(p);
        }
    }

    filtered
}

/// 检测网格线
#[wasm_bindgen]
pub fn detect_grid_lines(
    energy_u8: &[u8],
    width: usize,
    height: usize,
    gap_size: usize,
    gap_tolerance: usize,
    min_energy: f32,
    smooth_win: usize,
    window_size: usize,
) -> JsValue {
    // 验证输入数组长度
    let expected_len = width * height;
    if energy_u8.len() != expected_len {
        web_sys::console::error_1(
            &format!("detect_grid_lines: expected array length {}, got {}", expected_len, energy_u8.len()).into()
        );
        // 返回空结果
        let result = js_sys::Object::new();
        let empty = js_sys::Uint32Array::from(&[0u32][..]);
        js_sys::Reflect::set(&result, &"xLines".into(), &empty).unwrap();
        js_sys::Reflect::set(&result, &"yLines".into(), &empty).unwrap();
        return JsValue::from(result);
    }

    // 计算投影
    let mut x_prof = vec![0.0f32; width];
    let mut y_prof = vec![0.0f32; height];

    for y in 0..height {
        let row = y * width;
        let mut sum = 0.0f32;
        for x in 0..width {
            let v = energy_u8[row + x] as f32;
            x_prof[x] += v;
            sum += v;
        }
        y_prof[y] = sum;
    }

    let x_sm = smooth_1d_box(&x_prof, smooth_win);
    let y_sm = smooth_1d_box(&y_prof, smooth_win);

    let x_lines = detect_peaks_1d(&x_sm, gap_size, gap_tolerance, min_energy, window_size);
    let y_lines = detect_peaks_1d(&y_sm, gap_size, gap_tolerance, min_energy, window_size);

    // 转换为 u32 数组，然后转为 JS 数组
    let x_lines_u32: Vec<u32> = x_lines.into_iter().map(|x| x as u32).collect();
    let y_lines_u32: Vec<u32> = y_lines.into_iter().map(|x| x as u32).collect();
    let x_lines_js = js_sys::Uint32Array::from(x_lines_u32.as_slice());
    let y_lines_js = js_sys::Uint32Array::from(y_lines_u32.as_slice());

    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"xLines".into(), &x_lines_js).unwrap();
    js_sys::Reflect::set(&result, &"yLines".into(), &y_lines_js).unwrap();

    JsValue::from(result)
}

/// 计算中位数间距
fn median_gap(lines: &[usize], fallback: usize) -> usize {
    if lines.len() < 2 {
        return fallback;
    }

    let mut gaps: Vec<usize> = lines.windows(2).map(|w| w[1] - w[0]).collect();
    gaps.sort();
    gaps[gaps.len() / 2]
}

/// 插值缺失的网格线
#[wasm_bindgen]
pub fn interpolate_lines(lines: &[usize], limit: usize, fallback_gap: usize, interp_threshold: f32) -> Vec<usize> {
    if lines.is_empty() {
        return Vec::new();
    }

    let typical = median_gap(lines, fallback_gap);

    // 避免除零错误
    if typical == 0 {
        web_sys::console::error_1(&"interpolate_lines: typical gap is 0, cannot interpolate".into());
        return lines.to_vec();
    }

    let mut all: BTreeSet<usize> = lines.iter().copied().collect();

    // 在第一条线之前插值
    let first = lines[0];
    if first > typical {
        let num_before = (first / typical).max(1) - 1;
        for k in 1..=num_before {
            all.insert((k * first / (num_before + 1)) as usize);
        }
    }

    // 在线之间插值
    for i in 0..lines.len() - 1 {
        let a = lines[i];
        let b = lines[i + 1];
        let gap = b - a;

        // 使用 interp_threshold 参数控制插值阈值
        if gap > (typical as f32 * interp_threshold) as usize {
            let num_missing = (gap / typical).max(1) - 1;
            for k in 1..=num_missing {
                all.insert(a + ((k * gap / (num_missing + 1)) as usize));
            }
        }
    }

    // 在最后一条线之后插值
    let last = *lines.last().unwrap();
    if last < limit - typical {
        let remain = limit - last;
        let num_after = (remain / typical).max(1) - 1;
        for k in 1..=num_after {
            all.insert(last + ((k * remain / (num_after + 1)) as usize));
        }
    }

    let mut result: Vec<usize> = all.into_iter().collect();
    result.sort();
    result
}

/// 完善边缘（确保覆盖整个图像）
#[wasm_bindgen]
pub fn complete_edges(
    all_lines: &[usize],
    limit: usize,
    typical_gap: usize,
    gap_tolerance: usize,
) -> Vec<usize> {
    let mut lines: Vec<usize> = all_lines.to_vec();
    lines.sort();

    if lines.is_empty() {
        let mut result = vec![0];
        if limit > 0 {
            result.push(limit - 1);
        }
        return result;
    }

    // 向左扩展
    let first = lines[0];
    if first > 0 {
        let mut edge = Vec::new();
        let mut x = first;
        while x > 0 {
            if x < typical_gap {
                break;
            }
            x -= typical_gap;
            edge.push(x);
        }
        lines = {
            let combined: BTreeSet<usize> = edge.into_iter().chain(lines.into_iter()).collect();
            combined.into_iter().collect()
        };
        lines.sort();
    }

    // 向右扩展
    let last = *lines.last().unwrap();
    if last < limit - 1 {
        let mut edge = Vec::new();
        let mut x = last;
        while x < limit - 1 {
            x += typical_gap;
            if x < limit {
                edge.push(x);
            }
        }
        lines = {
            let combined: BTreeSet<usize> = lines.into_iter().chain(edge.into_iter()).collect();
            combined.into_iter().collect()
        };
        lines.sort();
    }

    // 根据容差规则过滤
    let mut filtered = Vec::new();
    for &line in &lines {
        if filtered.is_empty() {
            filtered.push(line);
        } else {
            let last = *filtered.last().unwrap();
            let spacing = line - last;
            if (spacing as isize - typical_gap as isize).abs() as usize <= gap_tolerance
                || spacing > typical_gap + gap_tolerance
            {
                filtered.push(line);
            }
        }
    }

    // 确保边缘存在
    filtered.sort();
    filtered.dedup();
    if filtered.first() != Some(&0) {
        filtered.insert(0, 0);
    }
    if filtered.last() != Some(&(limit - 1)) {
        filtered.push(limit - 1);
    }

    filtered
}

/// 直接比例采样（无需网格检测）
#[wasm_bindgen]
pub fn sample_pixel_art_direct(
    rgb: &[u8],
    width: usize,
    height: usize,
    target_width: usize,
    target_height: usize,
    mode: u32, // 0=direct, 1=center, 2=average, 3=weighted
    weight_ratio: f32,
    upscale_factor: usize,
    native_res: bool,
) -> JsValue {
    let cell_w = target_width;
    let cell_h = target_height;

    let out_w = if native_res { cell_w } else { cell_w * upscale_factor };
    let out_h = if native_res { cell_h } else { cell_h * upscale_factor };

    let mut out_rgb = vec![0u8; out_w * out_h * 3];
    let mut out_rgba = vec![0u8; out_w * out_h * 4];

    let scale_x = width as f32 / cell_w as f32;
    let scale_y = height as f32 / cell_h as f32;

    fn get_rgba(data: &[u8], width: usize, height: usize, x: usize, y: usize) -> (u8, u8, u8, u8) {
        let clamped_x = x.min(width - 1);
        let clamped_y = y.min(height - 1);
        let i = (clamped_y * width + clamped_x) * 4;
        (data[i], data[i + 1], data[i + 2], data[i + 3])
    }

    fn get_rgba_interpolated(data: &[u8], width: usize, height: usize, x: f32, y: f32) -> (u8, u8, u8, u8) {
        let clamped_x = x.max(0.0).min(width as f32 - 1.0);
        let clamped_y = y.max(0.0).min(height as f32 - 1.0);

        let x1 = clamped_x.floor() as usize;
        let y1 = clamped_y.floor() as usize;
        let x2 = (x1 + 1).min(width - 1);
        let y2 = (y1 + 1).min(height - 1);

        let fx = clamped_x - x1 as f32;
        let fy = clamped_y - y1 as f32;

        let (r1, g1, b1, a1) = get_rgba(data, width, height, x1, y1);
        let (r2, g2, b2, a2) = get_rgba(data, width, height, x2, y1);
        let (r3, g3, b3, a3) = get_rgba(data, width, height, x1, y2);
        let (r4, g4, b4, a4) = get_rgba(data, width, height, x2, y2);

        let w1 = (1.0 - fx) * (1.0 - fy);
        let w2 = fx * (1.0 - fy);
        let w3 = (1.0 - fx) * fy;
        let w4 = fx * fy;

        // 预乘 alpha 插值
        let a = ((a1 as f32 * w1 + a2 as f32 * w2 + a3 as f32 * w3 + a4 as f32 * w4).round()) as u8;
        let a_f = a.max(1) as f32;

        let r = (((r1 as f32 * a1 as f32 * w1 + r2 as f32 * a2 as f32 * w2
            + r3 as f32 * a3 as f32 * w3 + r4 as f32 * a4 as f32 * w4) / a_f).round()) as u8;
        let g = (((g1 as f32 * a1 as f32 * w1 + g2 as f32 * a2 as f32 * w2
            + g3 as f32 * a3 as f32 * w3 + g4 as f32 * a4 as f32 * w4) / a_f).round()) as u8;
        let b = (((b1 as f32 * a1 as f32 * w1 + b2 as f32 * a2 as f32 * w2
            + b3 as f32 * a3 as f32 * w3 + b4 as f32 * a4 as f32 * w4) / a_f).round()) as u8;

        (r, g, b, a)
    }

    for j in 0..cell_h {
        for i in 0..cell_w {
            let center_x = (i as f32 + 0.5) * scale_x;
            let center_y = (j as f32 + 0.5) * scale_y;

            let (r, g, b, a) = match mode {
                0 => get_rgba_interpolated(rgb, width, height, center_x, center_y), // direct
                1 => { // center
                    let x = center_x.floor() as usize;
                    let y = center_y.floor() as usize;
                    get_rgba(rgb, width, height, x, y)
                }
                2 => { // average
                    let x1 = (i as f32 * scale_x).floor() as usize;
                    let y1 = (j as f32 * scale_y).floor() as usize;
                    let x2 = (((i + 1) as f32 * scale_x).floor() as usize).min(width - 1);
                    let y2 = (((j + 1) as f32 * scale_y).floor() as usize).min(height - 1);

                    let mut sum_r = 0u32;
                    let mut sum_g = 0u32;
                    let mut sum_b = 0u32;
                    let mut sum_a = 0u32;
                    let mut cnt = 0usize;

                    for y in y1..=y2 {
                        for x in x1..=x2 {
                            let (rr, gg, bb, aa) = get_rgba(rgb, width, height, x, y);
                            sum_r += rr as u32 * aa as u32;
                            sum_g += gg as u32 * aa as u32;
                            sum_b += bb as u32 * aa as u32;
                            sum_a += aa as u32;
                            cnt += 1;
                        }
                    }

                    if cnt > 0 {
                        let avg_a = (sum_a / cnt as u32) as u8;
                        let r = (sum_r / cnt as u32) as u8;
                        let g = (sum_g / cnt as u32) as u8;
                        let b = (sum_b / cnt as u32) as u8;
                        (r, g, b, avg_a)
                    } else {
                        (0, 0, 0, 0)
                    }
                }
                _ => { // weighted
                    let region_size = (scale_x * weight_ratio).floor().max(1.0) as usize;
                    let cx = center_x.floor() as usize;
                    let cy = center_y.floor() as usize;
                    let x1 = cx.saturating_sub(region_size / 2);
                    let y1 = cy.saturating_sub(region_size / 2);
                    let x2 = (cx + region_size / 2).min(width - 1);
                    let y2 = (cy + region_size / 2).min(height - 1);

                    let mut sum_r = 0u32;
                    let mut sum_g = 0u32;
                    let mut sum_b = 0u32;
                    let mut sum_a = 0u32;
                    let mut cnt = 0usize;

                    for y in y1..=y2 {
                        for x in x1..=x2 {
                            let (rr, gg, bb, aa) = get_rgba(rgb, width, height, x, y);
                            sum_r += rr as u32 * aa as u32;
                            sum_g += gg as u32 * aa as u32;
                            sum_b += bb as u32 * aa as u32;
                            sum_a += aa as u32;
                            cnt += 1;
                        }
                    }

                    if cnt > 0 {
                        let avg_a = (sum_a / cnt as u32) as u8;
                        let r = (sum_r / cnt as u32) as u8;
                        let g = (sum_g / cnt as u32) as u8;
                        let b = (sum_b / cnt as u32) as u8;
                        (r, g, b, avg_a)
                    } else {
                        (0, 0, 0, 0)
                    }
                }
            };

            // 写入输出
            if native_res {
                let o = (j * out_w + i) * 3;
                let o4 = (j * out_w + i) * 4;
                out_rgb[o] = r;
                out_rgb[o + 1] = g;
                out_rgb[o + 2] = b;
                out_rgba[o4] = r;
                out_rgba[o4 + 1] = g;
                out_rgba[o4 + 2] = b;
                out_rgba[o4 + 3] = a;
            } else {
                let ox = i * upscale_factor;
                let oy = j * upscale_factor;
                for yy in 0..upscale_factor {
                    for xx in 0..upscale_factor {
                        let o = ((oy + yy) * out_w + (ox + xx)) * 3;
                        let o4 = ((oy + yy) * out_w + (ox + xx)) * 4;
                        out_rgb[o] = r;
                        out_rgb[o + 1] = g;
                        out_rgb[o + 2] = b;
                        out_rgba[o4] = r;
                        out_rgba[o4 + 1] = g;
                        out_rgba[o4 + 2] = b;
                        out_rgba[o4 + 3] = a;
                    }
                }
            }
        }
    }

    let out_rgb_js = js_sys::Uint8Array::from(out_rgb.as_slice());
    let out_rgba_js = js_sys::Uint8Array::from(out_rgba.as_slice());

    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"outW".into(), &JsValue::from(out_w as u32)).unwrap();
    js_sys::Reflect::set(&result, &"outH".into(), &JsValue::from(out_h as u32)).unwrap();
    js_sys::Reflect::set(&result, &"outRgb".into(), &out_rgb_js).unwrap();
    js_sys::Reflect::set(&result, &"outRgba".into(), &out_rgba_js).unwrap();

    JsValue::from(result)
}

/// 基于网格的像素采样
#[wasm_bindgen]
pub fn sample_pixel_art(
    rgb: &[u8],
    width: usize,
    height: usize,
    all_x: &[usize],
    all_y: &[usize],
    mode: u32,
    weight_ratio: f32,
    upscale_factor: usize,
    native_res: bool,
) -> JsValue {
    let cell_w = all_x.len() - 1;
    let cell_h = all_y.len() - 1;

    let out_w = if native_res { cell_w } else { cell_w * upscale_factor };
    let out_h = if native_res { cell_h } else { cell_h * upscale_factor };

    let mut out_rgb = vec![0u8; out_w * out_h * 3];
    let mut out_rgba = vec![0u8; out_w * out_h * 4];

    fn get_rgba(data: &[u8], width: usize, x: usize, y: usize) -> (u8, u8, u8, u8) {
        let i = (y * width + x) * 4;
        (data[i], data[i + 1], data[i + 2], data[i + 3])
    }

    for i in 0..cell_w {
        let x1 = all_x[i];
        let x2 = all_x[i + 1];
        let cx = (x1 + x2) / 2;

        for j in 0..cell_h {
            let y1 = all_y[j];
            let y2 = all_y[j + 1];
            let cy = (y1 + y2) / 2;

            let (r, g, b, a) = match mode {
                1 => { // center
                    get_rgba(rgb, width, cx, cy)
                }
                2 => { // average
                    let mut sum_r = 0u32;
                    let mut sum_g = 0u32;
                    let mut sum_b = 0u32;
                    let mut sum_a = 0u32;
                    let mut cnt = 0usize;

                    for y in y1..y2 {
                        for x in x1..x2 {
                            let (rr, gg, bb, aa) = get_rgba(rgb, width, x, y);
                            sum_r += rr as u32;
                            sum_g += gg as u32;
                            sum_b += bb as u32;
                            sum_a += aa as u32;
                            cnt += 1;
                        }
                    }

                    if cnt > 0 {
                        ((sum_r / cnt as u32) as u8,
                         (sum_g / cnt as u32) as u8,
                         (sum_b / cnt as u32) as u8,
                         (sum_a / cnt as u32) as u8)
                    } else {
                        (0, 0, 0, 255)
                    }
                }
                _ => { // weighted
                    let cw = x2 - x1;
                    let ch = y2 - y1;
                    let ww = (cw as f32 * weight_ratio).max(1.0) as usize;
                    let hh = (ch as f32 * weight_ratio).max(1.0) as usize;
                    let wx1 = cx.saturating_sub(ww / 2);
                    let wx2 = (cx + ww / 2).min(width);
                    let wy1 = cy.saturating_sub(hh / 2);
                    let wy2 = (cy + hh / 2).min(height);

                    let mut sum_r = 0u32;
                    let mut sum_g = 0u32;
                    let mut sum_b = 0u32;
                    let mut sum_a = 0u32;
                    let mut cnt = 0usize;

                    for y in wy1..wy2 {
                        for x in wx1..wx2 {
                            let (rr, gg, bb, aa) = get_rgba(rgb, width, x, y);
                            sum_r += rr as u32;
                            sum_g += gg as u32;
                            sum_b += bb as u32;
                            sum_a += aa as u32;
                            cnt += 1;
                        }
                    }

                    if cnt > 0 {
                        ((sum_r / cnt as u32) as u8,
                         (sum_g / cnt as u32) as u8,
                         (sum_b / cnt as u32) as u8,
                         (sum_a / cnt as u32) as u8)
                    } else {
                        (0, 0, 0, 255)
                    }
                }
            };

            // 写入输出
            if native_res {
                let o = (j * out_w + i) * 3;
                let o4 = (j * out_w + i) * 4;
                out_rgb[o] = r;
                out_rgb[o + 1] = g;
                out_rgb[o + 2] = b;
                out_rgba[o4] = r;
                out_rgba[o4 + 1] = g;
                out_rgba[o4 + 2] = b;
                out_rgba[o4 + 3] = a;
            } else {
                let ox = i * upscale_factor;
                let oy = j * upscale_factor;
                for yy in 0..upscale_factor {
                    for xx in 0..upscale_factor {
                        let o = ((oy + yy) * out_w + (ox + xx)) * 3;
                        let o4 = ((oy + yy) * out_w + (ox + xx)) * 4;
                        out_rgb[o] = r;
                        out_rgb[o + 1] = g;
                        out_rgb[o + 2] = b;
                        out_rgba[o4] = r;
                        out_rgba[o4 + 1] = g;
                        out_rgba[o4 + 2] = b;
                        out_rgba[o4 + 3] = a;
                    }
                }
            }
        }
    }

    let out_rgb_js = js_sys::Uint8Array::from(out_rgb.as_slice());
    let out_rgba_js = js_sys::Uint8Array::from(out_rgba.as_slice());

    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"outW".into(), &JsValue::from(out_w as u32)).unwrap();
    js_sys::Reflect::set(&result, &"outH".into(), &JsValue::from(out_h as u32)).unwrap();
    js_sys::Reflect::set(&result, &"outRgb".into(), &out_rgb_js).unwrap();
    js_sys::Reflect::set(&result, &"outRgba".into(), &out_rgba_js).unwrap();

    JsValue::from(result)
}
