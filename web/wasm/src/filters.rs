use wasm_bindgen::prelude::*;

/// 边界反射处理 (reflect101 模式)
fn reflect101(x: i32, limit: usize) -> usize {
    if x < 0 {
        (-x) as usize
    } else if x as usize >= limit {
        let limit = limit as i32;
        (2 * limit - 2 - x) as usize
    } else {
        x as usize
    }
}

/// 生成 1D 高斯核
#[wasm_bindgen]
pub fn gaussian_kernel_1d(sigma: f64) -> Vec<f32> {
    if sigma <= 0.0 {
        return vec![1.0];
    }
    let radius = (3.0 * sigma).ceil().max(1.0) as i32;
    let size = (radius * 2 + 1) as usize;
    let mut k = vec![0.0f32; size];
    let s2 = sigma * sigma;
    let mut sum = 0.0f32;

    for i in -radius..=radius {
        let v = (-(i * i) as f64 / (2.0 * s2)).exp() as f32;
        k[(i + radius) as usize] = v;
        sum += v;
    }

    for i in 0..size {
        k[i] /= sum;
    }

    k
}

/// 可分离卷积 (先水平后垂直)
#[wasm_bindgen]
pub fn convolve_separable(src: &[f32], width: usize, height: usize, k: &[f32]) -> Vec<f32> {
    let radius = (k.len() - 1) / 2;
    let mut tmp = vec![0.0f32; src.len()];
    let mut dst = vec![0.0f32; src.len()];

    // 水平卷积
    for y in 0..height {
        let row = y * width;
        for x in 0..width {
            let mut acc = 0.0f32;
            let radius_i = radius as i32;
            for t in -radius_i..=radius_i {
                let xx = reflect101(x as i32 + t, width);
                unsafe {
                    acc += src.get_unchecked(row + xx) * k.get_unchecked((t + radius_i) as usize);
                }
            }
            tmp[row + x] = acc;
        }
    }

    // 垂直卷积
    for y in 0..height {
        for x in 0..width {
            let mut acc = 0.0f32;
            let radius_i = radius as i32;
            for t in -radius_i..=radius_i {
                let yy = reflect101(y as i32 + t, height);
                unsafe {
                    acc += tmp.get_unchecked(yy * width + x) * k.get_unchecked((t + radius_i) as usize);
                }
            }
            dst[y * width + x] = acc;
        }
    }

    dst
}

/// Sobel 边缘检测算子
/// 返回 (gx, gy) 两个梯度图
#[wasm_bindgen]
pub fn sobel(src: &[f32], width: usize, height: usize) -> JsValue {
    let mut gx = vec![0.0f32; src.len()];
    let mut gy = vec![0.0f32; src.len()];

    // Sobel kernels
    // Gx = [-1 0 1; -2 0 2; -1 0 1]
    // Gy = [-1 -2 -1; 0 0 0; 1 2 1]

    for y in 0..height {
        let y0 = reflect101(y as i32 - 1, height);
        let y2 = reflect101(y as i32 + 1, height);

        for x in 0..width {
            let x0 = reflect101(x as i32 - 1, width);
            let x2 = reflect101(x as i32 + 1, width);

            unsafe {
                let a00 = src.get_unchecked(y0 * width + x0);
                let a01 = src.get_unchecked(y0 * width + x);
                let a02 = src.get_unchecked(y0 * width + x2);
                let a10 = src.get_unchecked(y * width + x0);
                let a12 = src.get_unchecked(y * width + x2);
                let a20 = src.get_unchecked(y2 * width + x0);
                let a21 = src.get_unchecked(y2 * width + x);
                let a22 = src.get_unchecked(y2 * width + x2);

                let idx = y * width + x;
                gx[idx] = (-a00 + a02) + (-2.0 * a10 + 2.0 * a12) + (-a20 + a22);
                gy[idx] = (-a00 - 2.0 * a01 - a02) + (a20 + 2.0 * a21 + a22);
            }
        }
    }

    // 返回对象 { gx: Float32Array, gy: Float32Array }
    let gx_array: js_sys::Float32Array = gx.as_slice().into();
    let gy_array: js_sys::Float32Array = gy.as_slice().into();

    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"gx".into(), &gx_array).unwrap();
    js_sys::Reflect::set(&result, &"gy".into(), &gy_array).unwrap();

    JsValue::from(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gaussian_kernel() {
        let k = gaussian_kernel_1d(1.0);
        assert_eq!(k.len(), 7); // radius = ceil(3*1) = 3, size = 7
        let sum: f32 = k.iter().sum();
        assert!((sum - 1.0).abs() < 0.0001);
    }

    #[test]
    fn test_reflect101() {
        assert_eq!(reflect101(0, 10), 0);
        assert_eq!(reflect101(5, 10), 5);
        assert_eq!(reflect101(9, 10), 9);
        assert_eq!(reflect101(-1, 10), 1);
        assert_eq!(reflect101(-2, 10), 2);
        assert_eq!(reflect101(10, 10), 8);
        assert_eq!(reflect101(11, 10), 7);
    }
}
