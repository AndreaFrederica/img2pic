let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

/**
 * 完善边缘（确保覆盖整个图像）
 * @param {Uint32Array} all_lines
 * @param {number} limit
 * @param {number} typical_gap
 * @param {number} gap_tolerance
 * @returns {Uint32Array}
 */
export function complete_edges(all_lines, limit, typical_gap, gap_tolerance) {
    const ptr0 = passArray32ToWasm0(all_lines, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.complete_edges(ptr0, len0, limit, typical_gap, gap_tolerance);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * 可分离卷积 (先水平后垂直)
 * @param {Float32Array} src
 * @param {number} width
 * @param {number} height
 * @param {Float32Array} k
 * @returns {Float32Array}
 */
export function convolve_separable(src, width, height, k) {
    const ptr0 = passArrayF32ToWasm0(src, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF32ToWasm0(k, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.convolve_separable(ptr0, len0, width, height, ptr1, len1);
    var v3 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v3;
}

/**
 * 检测网格线
 * @param {Uint8Array} energy_u8
 * @param {number} width
 * @param {number} height
 * @param {number} gap_size
 * @param {number} gap_tolerance
 * @param {number} min_energy
 * @param {number} smooth_win
 * @param {number} window_size
 * @returns {any}
 */
export function detect_grid_lines(energy_u8, width, height, gap_size, gap_tolerance, min_energy, smooth_win, window_size) {
    const ptr0 = passArray8ToWasm0(energy_u8, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.detect_grid_lines(ptr0, len0, width, height, gap_size, gap_tolerance, min_energy, smooth_win, window_size);
    return ret;
}

/**
 * 1D 峰值检测
 * @param {Float32Array} profile
 * @param {number} gap_size
 * @param {number} gap_tolerance
 * @param {number} min_threshold_ratio
 * @param {number} window_size
 * @returns {Uint32Array}
 */
export function detect_peaks_1d(profile, gap_size, gap_tolerance, min_threshold_ratio, window_size) {
    const ptr0 = passArrayF32ToWasm0(profile, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.detect_peaks_1d(ptr0, len0, gap_size, gap_tolerance, min_threshold_ratio, window_size);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * 检测像素大小（通过自相关分析）
 * @param {Uint8Array} energy_u8
 * @param {number} width
 * @param {number} height
 * @param {number} min_s
 * @param {number} max_s
 * @returns {number}
 */
export function detect_pixel_size(energy_u8, width, height, min_s, max_s) {
    const ptr0 = passArray8ToWasm0(energy_u8, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.detect_pixel_size(ptr0, len0, width, height, min_s, max_s);
    return ret >>> 0;
}

/**
 * 方向性能量增强
 * 增强/削弱水平或垂直边缘
 * @param {Float32Array} energy
 * @param {number} width
 * @param {number} height
 * @param {number} horizontal_factor
 * @param {number} vertical_factor
 * @returns {Float32Array}
 */
export function enhance_energy_directional(energy, width, height, horizontal_factor, vertical_factor) {
    const ptr0 = passArrayF32ToWasm0(energy, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.enhance_energy_directional(ptr0, len0, width, height, horizontal_factor, vertical_factor);
    var v2 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * 生成 1D 高斯核
 * @param {number} sigma
 * @returns {Float32Array}
 */
export function gaussian_kernel_1d(sigma) {
    const ret = wasm.gaussian_kernel_1d(sigma);
    var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * 计算梯度能量图
 * 先用高斯模糊（可选），再用 Sobel 算子计算梯度
 * @param {Float32Array} gray01
 * @param {number} width
 * @param {number} height
 * @param {number} sigma
 * @returns {Float32Array}
 */
export function grad_energy(gray01, width, height, sigma) {
    const ptr0 = passArrayF32ToWasm0(gray01, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.grad_energy(ptr0, len0, width, height, sigma);
    var v2 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

export function init_panic_hook() {
    wasm.init_panic_hook();
}

/**
 * 插值缺失的网格线
 * @param {Uint32Array} lines
 * @param {number} limit
 * @param {number} fallback_gap
 * @param {number} interp_threshold
 * @returns {Uint32Array}
 */
export function interpolate_lines(lines, limit, fallback_gap, interp_threshold) {
    const ptr0 = passArray32ToWasm0(lines, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.interpolate_lines(ptr0, len0, limit, fallback_gap, interp_threshold);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * 近似分位数计算（采样避免全排序）
 * @param {Float32Array} x
 * @param {number} q
 * @returns {number}
 */
export function quantile_approx(x, q) {
    const ptr0 = passArrayF32ToWasm0(x, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.quantile_approx(ptr0, len0, q);
    return ret;
}

/**
 * RGBA 转 0-1 范围的灰度图
 * 使用标准亮度系数: 0.299*R + 0.587*G + 0.114*B
 * @param {Uint8Array} rgba
 * @param {number} width
 * @param {number} height
 * @returns {Float32Array}
 */
export function rgba_to_gray01(rgba, width, height) {
    const ptr0 = passArray8ToWasm0(rgba, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.rgba_to_gray01(ptr0, len0, width, height);
    var v2 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * 基于网格的像素采样
 * @param {Uint8Array} rgb
 * @param {number} width
 * @param {number} height
 * @param {Uint32Array} all_x
 * @param {Uint32Array} all_y
 * @param {number} mode
 * @param {number} weight_ratio
 * @param {number} upscale_factor
 * @param {boolean} native_res
 * @returns {any}
 */
export function sample_pixel_art(rgb, width, height, all_x, all_y, mode, weight_ratio, upscale_factor, native_res) {
    const ptr0 = passArray8ToWasm0(rgb, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(all_x, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray32ToWasm0(all_y, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.sample_pixel_art(ptr0, len0, width, height, ptr1, len1, ptr2, len2, mode, weight_ratio, upscale_factor, native_res);
    return ret;
}

/**
 * 直接比例采样（无需网格检测）
 * @param {Uint8Array} rgb
 * @param {number} width
 * @param {number} height
 * @param {number} target_width
 * @param {number} target_height
 * @param {number} mode
 * @param {number} weight_ratio
 * @param {number} upscale_factor
 * @param {boolean} native_res
 * @returns {any}
 */
export function sample_pixel_art_direct(rgb, width, height, target_width, target_height, mode, weight_ratio, upscale_factor, native_res) {
    const ptr0 = passArray8ToWasm0(rgb, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.sample_pixel_art_direct(ptr0, len0, width, height, target_width, target_height, mode, weight_ratio, upscale_factor, native_res);
    return ret;
}

/**
 * Sobel 边缘检测算子
 * 返回 (gx, gy) 两个梯度图
 * @param {Float32Array} src
 * @param {number} width
 * @param {number} height
 * @returns {any}
 */
export function sobel(src, width, height) {
    const ptr0 = passArrayF32ToWasm0(src, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.sobel(ptr0, len0, width, height);
    return ret;
}

/**
 * 将能量图转换为 8 位灰度图（热力图）
 * @param {Float32Array} energy
 * @returns {Uint8Array}
 */
export function to_heatmap_u8(energy) {
    const ptr0 = passArrayF32ToWasm0(energy, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.to_heatmap_u8(ptr0, len0);
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

export function __wbg___wbindgen_debug_string_adfb662ae34724b6(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_throw_dd24417ed36fc46e(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_error_7bc7d576a6aaf855(arg0) {
    console.error(arg0);
};

export function __wbg_get_af9dab7e9603ea93() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_length_86ce4877baf913bb(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_log_1d990106d99dacb7(arg0) {
    console.log(arg0);
};

export function __wbg_new_1ba21ce319a06297() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_from_slice_41e2764a343e3cb1(arg0, arg1) {
    const ret = new Float32Array(getArrayF32FromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_new_from_slice_db0691b69e9d3891(arg0, arg1) {
    const ret = new Uint32Array(getArrayU32FromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_new_from_slice_f9c22b9153b26992(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_prototypesetcall_96cc7097487b926d(arg0, arg1, arg2) {
    Float32Array.prototype.set.call(getArrayF32FromWasm0(arg0, arg1), arg2);
};

export function __wbg_set_781438a03c0c3c81() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
};
