use wasm_bindgen::prelude::*;
use crate::filters::{gaussian_kernel_1d, convolve_separable, sobel};

/// 近似分位数计算（采样避免全排序）
#[wasm_bindgen]
pub fn quantile_approx(x: &[f32], q: f64) -> f32 {
    if x.is_empty() {
        return 0.0;
    }

    let n = x.len();
    let sample_max = 200_000_usize;
    let step = (n / sample_max).max(1);

    let mut sample: Vec<f32> = x.iter().step_by(step).copied().collect();
    sample.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let idx = ((q * (sample.len() - 1) as f64).floor() as usize)
        .max(0)
        .min(sample.len() - 1);

    sample[idx]
}

/// RGBA 转 0-1 范围的灰度图
/// 使用标准亮度系数: 0.299*R + 0.587*G + 0.114*B
#[wasm_bindgen]
pub fn rgba_to_gray01(rgba: &[u8], width: usize, height: usize) -> Vec<f32> {
    let pixel_count = width * height;
    let mut gray = vec![0.0f32; pixel_count];

    for (p, pixel) in gray.iter_mut().enumerate() {
        let i = p * 4;
        let r = rgba[i] as f32 / 255.0;
        let g = rgba[i + 1] as f32 / 255.0;
        let b = rgba[i + 2] as f32 / 255.0;
        // 标准亮度系数 (Rec. 601)
        *pixel = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    gray
}

/// 计算梯度能量图
/// 先用高斯模糊（可选），再用 Sobel 算子计算梯度
#[wasm_bindgen]
pub fn grad_energy(gray01: &[f32], width: usize, height: usize, sigma: f64) -> Vec<f32> {
    let g = if sigma > 0.0 {
        let k = gaussian_kernel_1d(sigma);
        convolve_separable(gray01, width, height, &k)
    } else {
        gray01.to_vec()
    };

    // 从 JS 对象中获取 gx 和 gy
    let sobel_result = sobel(&g, width, height);
    let result_obj = js_sys::Object::from(sobel_result);

    let gx_val = js_sys::Reflect::get(&result_obj, &"gx".into()).unwrap();
    let gy_val = js_sys::Reflect::get(&result_obj, &"gy".into()).unwrap();

    let gx_array = js_sys::Float32Array::from(gx_val);
    let gy_array = js_sys::Float32Array::from(gy_val);

    let mut gx_vec = vec![0.0f32; g.len()];
    let mut gy_vec = vec![0.0f32; g.len()];
    gx_array.copy_to(&mut gx_vec);
    gy_array.copy_to(&mut gy_vec);

    let mut energy = vec![0.0f32; g.len()];
    for i in 0..energy.len() {
        energy[i] = gx_vec[i].abs() + gy_vec[i].abs();
    }

    energy
}

/// 方向性能量增强
/// 增强/削弱水平或垂直边缘
#[wasm_bindgen]
pub fn enhance_energy_directional(
    energy: &[f32],
    width: usize,
    height: usize,
    horizontal_factor: f32,
    vertical_factor: f32,
) -> Vec<f32> {
    if (horizontal_factor - 1.0).abs() < 0.001 && (vertical_factor - 1.0).abs() < 0.001 {
        return energy.to_vec();
    }

    let sobel_result = sobel(energy, width, height);
    let result_obj = js_sys::Object::from(sobel_result);

    let gx_val = js_sys::Reflect::get(&result_obj, &"gx".into()).unwrap();
    let gy_val = js_sys::Reflect::get(&result_obj, &"gy".into()).unwrap();

    let gx_array = js_sys::Float32Array::from(gx_val);
    let gy_array = js_sys::Float32Array::from(gy_val);

    let mut gx_vec = vec![0.0f32; energy.len()];
    let mut gy_vec = vec![0.0f32; energy.len()];
    gx_array.copy_to(&mut gx_vec);
    gy_array.copy_to(&mut gy_vec);

    let mut out = vec![0.0f32; energy.len()];

    for i in 0..out.len() {
        let mut v = energy[i];
        if horizontal_factor > 1.0 {
            v += gy_vec[i].abs() * (horizontal_factor - 1.0);
        }
        if vertical_factor > 1.0 {
            v += gx_vec[i].abs() * (vertical_factor - 1.0);
        }
        out[i] = v;
    }

    // 裁剪到 p99.9
    let clip_v = quantile_approx(&out, 0.999);
    for v in out.iter_mut() {
        *v = v.min(clip_v);
    }

    out
}

/// 将能量图转换为 8 位灰度图（热力图）
#[wasm_bindgen]
pub fn to_heatmap_u8(energy: &[f32]) -> Vec<u8> {
    let p99 = quantile_approx(energy, 0.99);
    let denom = p99 + 1e-6;

    let mut u8 = vec![0u8; energy.len()];
    for (i, &v) in energy.iter().enumerate() {
        let mut normalized = v / denom;
        if normalized < 0.0 {
            normalized = 0.0;
        } else if normalized > 1.0 {
            normalized = 1.0;
        }
        u8[i] = (normalized * 255.0) as u8;
    }

    u8
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_quantile_approx() {
        let x = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let q50 = quantile_approx(&x, 0.5);
        assert!((q50 - 3.0).abs() < 0.1);

        let q0 = quantile_approx(&x, 0.0);
        assert_eq!(q0, 1.0);
    }

    #[test]
    fn test_rgba_to_gray01() {
        // 纯白 RGBA
        let rgba = vec![255u8, 255, 255, 255];
        let gray = rgba_to_gray01(&rgba, 1, 1);
        assert_eq!(gray.len(), 1);
        assert!((gray[0] - 1.0).abs() < 0.01);

        // 纯黑 RGBA
        let rgba = vec![0u8, 0, 0, 255];
        let gray = rgba_to_gray01(&rgba, 1, 1);
        assert_eq!(gray.len(), 1);
        assert!((gray[0] - 0.0).abs() < 0.01);
    }
}
