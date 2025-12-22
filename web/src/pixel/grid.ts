import type { SampleMode } from "./types";

function detrend1d(x: Float32Array, win: number): Float32Array {
  let w = Math.max(3, win | 0);
  if ((w & 1) === 0) w += 1;

  const half = w >> 1;
  const sm = new Float32Array(x.length);
  const out = new Float32Array(x.length);

  // simple moving average with reflect borders
  for (let i = 0; i < x.length; i++) {
    let acc = 0;
    for (let t = -half; t <= half; t++) {
      let j = i + t;
      if (j < 0) j = -j;
      if (j >= x.length) j = 2 * x.length - 2 - j;
      const val = x[j];
      acc += val !== undefined ? val : 0;
    }
    sm[i] = acc / w;
  }

  let mean = 0;
  for (let i = 0; i < x.length; i++) {
    const xVal = x[i];
    const smVal = sm[i];
    const diff = (xVal !== undefined ? xVal : 0) - (smVal !== undefined ? smVal : 0);
    out[i] = diff;
    mean += diff;
  }
  mean /= x.length;
  for (let i = 0; i < x.length; i++) {
    out[i]! -= mean;
  }
  return out;
}

function autocorrScore(x: Float32Array, lag: number): number {
  const n = x.length - lag;
  if (n <= 10) return -1e9;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] || 0;
    const b = x[i + lag] || 0;
    dot += a * b;
    na += a * a;
    nb += b * b;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

export function detectPixelSize(energyU8: Uint8Array, width: number, height: number, minS: number, maxS: number): number {
  // projections
  const px = new Float32Array(width);
  const py = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const v = energyU8[row + x] || 0;
      px[x]! += v;
      rowSum += v;
    }
    py[y] = rowSum;
  }

  const pxDt = detrend1d(px, Math.min(401, Math.max(31, ((width / 10) | 0) * 2 + 1)));
  const pyDt = detrend1d(py, Math.min(401, Math.max(31, ((height / 10) | 0) * 2 + 1)));

  let bestS = minS;
  let best = -1e9;
  for (let s = minS; s <= maxS; s++) {
    const sx = autocorrScore(pxDt, s);
    const sy = autocorrScore(pyDt, s);
    const score = sx + sy;
    if (score > best) {
      best = score;
      bestS = s;
    }
  }
  return bestS;
}

function smooth1dBox(x: Float32Array, win: number): Float32Array {
  const w = Math.max(1, win | 0);
  if (w <= 1) return x;
  const half = (w >> 1);
  const out = new Float32Array(x.length);

  for (let i = 0; i < x.length; i++) {
    let acc = 0;
    let cnt = 0;
    for (let t = -half; t <= half; t++) {
      const j = i + t;
      if (j >= 0 && j < x.length) {
        const val = x[j];
        acc += val !== undefined ? val : 0;
        cnt++;
      }
    }
    out[i] = acc / cnt;
  }
  return out;
}

export function detectPeaks1d(
  profile: Float32Array,
  gapSize: number,
  gapTolerance: number,
  minThresholdRatio: number,
  windowSize: number
): number[] {
  let maxV = 0;
  for (let i = 0; i < profile.length; i++) {
    const val = profile[i];
    if (val !== undefined && val > maxV) maxV = val;
  }
  if (maxV <= 0) return [];

  const threshold = minThresholdRatio * maxV;

  const w = Math.max(5, windowSize > 0 ? windowSize : Math.max(gapSize, 5));
  const step = Math.max(1, (gapSize / 2) | 0);

  const detected = new Set<number>();

  for (let start = 0; start <= profile.length - w; start += step) {
    const end = start + w;
    let localMax = -1e18;
    let localIdx = 0;
    for (let i = start; i < end; i++) {
      const v = profile[i];
      if (v !== undefined && v > localMax) {
        localMax = v;
        localIdx = i;
      }
    }
    if (localMax < threshold) continue;

    const p = localIdx;
    const pVal = profile[p];
    const leftVal = p > 0 ? profile[p - 1] : undefined;
    const rightVal = p < profile.length - 1 ? profile[p + 1] : undefined;
    const leftOk = p <= 0 || (pVal !== undefined && leftVal !== undefined && pVal > leftVal);
    const rightOk = p >= profile.length - 1 || (pVal !== undefined && rightVal !== undefined && pVal > rightVal);
    if (leftOk && rightOk) detected.add(p);
  }

  const peaks = Array.from(detected).sort((a, b) => a - b);
  if (peaks.length === 0) return [];

  // refine in neighborhood
  const refined: number[] = [];
  const rad = Math.max(1, (gapSize / 4) | 0);
  for (const p of peaks) {
    const s = Math.max(0, p - rad);
    const e = Math.min(profile.length, p + rad + 1);
    let best = -1e18;
    let bestIdx = p;
    for (let i = s; i < e; i++) {
      const v = profile[i];
      if (v !== undefined && v > best) {
        best = v;
        bestIdx = i;
      }
    }
    refined.push(bestIdx);
  }
  refined.sort((a, b) => a - b);

  // spacing filter
  const filtered: number[] = refined.length > 0 ? [refined[0]!] : [];
  for (let i = 1; i < refined.length; i++) {
    const p = refined[i]!;
    const last = filtered[filtered.length - 1]!;
    const spacing = p - last;
    if (Math.abs(spacing - gapSize) <= gapTolerance || spacing > gapSize + gapTolerance) {
      filtered.push(p);
    }
  }
  return filtered;
}

export function detectGridLines(
  energyU8: Uint8Array,
  width: number,
  height: number,
  gapSize: number,
  gapTolerance: number,
  minEnergy: number,
  smoothWin: number,
  windowSize: number
): { xLines: number[]; yLines: number[] } {
  const xProf = new Float32Array(width);
  const yProf = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const v = energyU8[row + x] || 0;
      xProf[x]! += v;
      sum += v;
    }
    yProf[y] = sum;
  }

  const xSm = smooth1dBox(xProf, smoothWin);
  const ySm = smooth1dBox(yProf, smoothWin);

  return {
    xLines: detectPeaks1d(xSm, gapSize, gapTolerance, minEnergy, windowSize),
    yLines: detectPeaks1d(ySm, gapSize, gapTolerance, minEnergy, windowSize),
  };
}

function medianGap(lines: number[], fallback: number): number {
  if (lines.length < 2) return fallback;
  const gaps: number[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const curr = lines[i]!;
    const next = lines[i + 1]!;
    gaps.push(next - curr);
  }
  gaps.sort((a, b) => a - b);
  const idx = (gaps.length / 2) | 0;
  return gaps[idx] || fallback;
}

export function interpolateLines(
  lines: number[],
  limit: number,
  fallbackGap: number,
  interpThreshold: number = 1.5
): number[] {
  if (lines.length === 0) return [];
  const typical = medianGap(lines, fallbackGap);

  const all: number[] = [...lines];

  // before
  const first = lines[0];
  if (first !== undefined && first > typical) {
    const numBefore = Math.max(1, Math.round(first / typical) - 1);
    for (let k = 1; k <= numBefore; k++) {
      all.push((k * first / (numBefore + 1)) | 0);
    }
  }

  // gaps
  for (let i = 0; i < lines.length - 1; i++) {
    const a = lines[i]!;
    const b = lines[i + 1]!;
    const gap = b - a;
    if (gap > typical * interpThreshold) {
      const numMissing = Math.max(1, Math.round(gap / typical) - 1);
      for (let k = 1; k <= numMissing; k++) {
        all.push(a + ((k * gap / (numMissing + 1)) | 0));
      }
    }
  }

  // after
  const last = lines[lines.length - 1]!;
  if (last < limit - typical) {
    const remain = limit - last;
    const numAfter = Math.max(1, Math.round(remain / typical) - 1);
    for (let k = 1; k <= numAfter; k++) {
      all.push(last + ((k * remain / (numAfter + 1)) | 0));
    }
  }

  return Array.from(new Set(all)).sort((x, y) => x - y);
}

export function completeEdges(
  allLines: number[],
  limit: number,
  typicalGap: number,
  gapTolerance: number
): number[] {
  let lines = [...allLines].sort((a, b) => a - b);

  if (lines.length === 0) return [0, limit - 1];

  // extend left
  const first = lines[0];
  if (first !== undefined && first > 0) {
    let x = first;
    const edge: number[] = [];
    while (x > 0) {
      x -= typicalGap;
      if (x >= 0) edge.push(x);
    }
    lines = Array.from(new Set([...edge, ...lines])).sort((a, b) => a - b);
  }

  // extend right
  const lastLine = lines[lines.length - 1]!;
  if (lastLine < limit - 1) {
    let x = lastLine;
    const edge: number[] = [];
    while (x < limit - 1) {
      x += typicalGap;
      if (x < limit) edge.push(x);
    }
    lines = Array.from(new Set([...lines, ...edge])).sort((a, b) => a - b);
  }

  // filter by tolerance rule
  const filtered: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (filtered.length === 0) {
      filtered.push(line);
    } else {
      const last = filtered[filtered.length - 1]!;
      const spacing = line - last;
      if (Math.abs(spacing - typicalGap) <= gapTolerance || spacing > typicalGap + gapTolerance) {
        filtered.push(line);
      }
    }
  }

  // ensure edges
  const out = Array.from(new Set(filtered)).sort((a, b) => a - b);
  if (out[0] !== 0) out.unshift(0);
  if (out[out.length - 1]! !== limit - 1) out.push(limit - 1);
  return out;
}

export function samplePixelArtDirect(
  rgb: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,
  nativeRes: boolean
): { outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array } {
  const cellW = targetWidth;
  const cellH = targetHeight;

  const outW = nativeRes ? cellW : cellW * upscaleFactor;
  const outH = nativeRes ? cellH : cellH * upscaleFactor;
  const outRgb = new Uint8Array(outW * outH * 3);
  const outRgba = new Uint8Array(outW * outH * 4);

  const scaleX = width / cellW;
  const scaleY = height / cellH;

  function getRgba(x: number, y: number): [number, number, number, number] {
    // 边界检查：确保坐标在有效范围内
    const clampedX = Math.max(0, Math.min(x, width - 1));
    const clampedY = Math.max(0, Math.min(y, height - 1));
    const i = (clampedY * width + clampedX) * 4;
    return [rgb[i] || 0, rgb[i + 1] || 0, rgb[i + 2] || 0, rgb[i + 3] || 0];
  }

  function getRgbaInterpolated(x: number, y: number): [number, number, number, number] {
    // 边界检查：确保坐标在有效范围内
    const clampedX = Math.max(0, Math.min(x, width - 1));
    const clampedY = Math.max(0, Math.min(y, height - 1));

    const x1 = Math.floor(clampedX);
    const y1 = Math.floor(clampedY);
    const x2 = Math.min(x1 + 1, width - 1);
    const y2 = Math.min(y1 + 1, height - 1);

    const fx = clampedX - x1;
    const fy = clampedY - y1;

    const [r1, g1, b1, a1] = getRgba(x1, y1);
    const [r2, g2, b2, a2] = getRgba(x2, y1);
    const [r3, g3, b3, a3] = getRgba(x1, y2);
    const [r4, g4, b4, a4] = getRgba(x2, y2);

    // 使用预乘 alpha 进行插值，避免透明像素的黑色边缘
    const w1 = (1 - fx) * (1 - fy);
    const w2 = fx * (1 - fy);
    const w3 = (1 - fx) * fy;
    const w4 = fx * fy;

    // 先插值 alpha
    const a = Math.round(a1 * w1 + a2 * w2 + a3 * w3 + a4 * w4);

    // 对于 RGB，使用预乘 alpha 插值
    const r = Math.round((r1 * a1 * w1 + r2 * a2 * w2 + r3 * a3 * w3 + r4 * a4 * w4) / Math.max(a, 1));
    const g = Math.round((g1 * a1 * w1 + g2 * a2 * w2 + g3 * a3 * w3 + g4 * a4 * w4) / Math.max(a, 1));
    const b = Math.round((b1 * a1 * w1 + b2 * a2 * w2 + b3 * a3 * w3 + b4 * a4 * w4) / Math.max(a, 1));

    return [r, g, b, a];
  }

  for (let j = 0; j < cellH; j++) {
    for (let i = 0; i < cellW; i++) {
      const centerX = (i + 0.5) * scaleX;
      const centerY = (j + 0.5) * scaleY;

      let r = 0, g = 0, b = 0, a = 255;

      if (mode === "direct") {
        // 使用双线性插值获得更好的质量
        [r, g, b, a] = getRgbaInterpolated(centerX, centerY);
      } else if (mode === "center") {
        const x = Math.max(0, Math.min(Math.floor(centerX), width - 1));
        const y = Math.max(0, Math.min(Math.floor(centerY), height - 1));
        [r, g, b, a] = getRgba(x, y);
      } else if (mode === "average") {
        // 计算当前像素对应的源图像区域
        const x1 = Math.max(0, Math.floor(i * scaleX));
        const y1 = Math.max(0, Math.floor(j * scaleY));
        const x2 = Math.min(Math.floor((i + 1) * scaleX), width - 1);
        const y2 = Math.min(Math.floor((j + 1) * scaleY), height - 1);

        let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
        let cnt = 0;
        for (let y = y1; y <= y2; y++) {
          for (let x = x1; x <= x2; x++) {
            const [rr, gg, bb, aa] = getRgba(x, y);
            // 使用预乘 alpha
            sumR += rr * aa;
            sumG += gg * aa;
            sumB += bb * aa;
            sumA += aa;
            cnt++;
          }
        }
        if (cnt > 0) {
          // 计算平均 alpha 值
          const avgA = sumA / cnt;
          r = Math.round(sumR / cnt);
          g = Math.round(sumG / cnt);
          b = Math.round(sumB / cnt);
          a = Math.round(avgA);
        } else {
          // 如果没有有效像素，设置为透明
          r = 0;
          g = 0;
          b = 0;
          a = 0;
        }
      } else {
        // weighted 模式
        const regionSize = Math.max(1, Math.floor(scaleX * weightRatio));
        const x1 = Math.max(0, Math.floor(centerX - regionSize / 2));
        const y1 = Math.max(0, Math.floor(centerY - regionSize / 2));
        const x2 = Math.min(width - 1, Math.floor(centerX + regionSize / 2));
        const y2 = Math.min(height - 1, Math.floor(centerY + regionSize / 2));

        let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
        let cnt = 0;
        for (let y = y1; y <= y2; y++) {
          for (let x = x1; x <= x2; x++) {
            const [rr, gg, bb, aa] = getRgba(x, y);
            // 使用预乘 alpha
            sumR += rr * aa;
            sumG += gg * aa;
            sumB += bb * aa;
            sumA += aa;
            cnt++;
          }
        }
        if (cnt > 0) {
          // 计算平均 alpha 值
          const avgA = sumA / cnt;
          r = Math.round(sumR / cnt);
          g = Math.round(sumG / cnt);
          b = Math.round(sumB / cnt);
          a = Math.round(avgA);
        } else {
          // 如果没有有效像素，设置为透明
          r = 0;
          g = 0;
          b = 0;
          a = 0;
        }
      }

      if (nativeRes) {
        const o = (j * outW + i) * 3;
        const o4 = (j * outW + i) * 4;
        outRgb[o] = r; outRgb[o + 1] = g; outRgb[o + 2] = b;
        outRgba[o4] = r; outRgba[o4 + 1] = g; outRgba[o4 + 2] = b; outRgba[o4 + 3] = a;
      } else {
        const ox = i * upscaleFactor;
        const oy = j * upscaleFactor;
        for (let yy = 0; yy < upscaleFactor; yy++) {
          for (let xx = 0; xx < upscaleFactor; xx++) {
            const o = ((oy + yy) * outW + (ox + xx)) * 3;
            const o4 = ((oy + yy) * outW + (ox + xx)) * 4;
            outRgb[o] = r; outRgb[o + 1] = g; outRgb[o + 2] = b;
            outRgba[o4] = r; outRgba[o4 + 1] = g; outRgba[o4 + 2] = b; outRgba[o4 + 3] = a;
          }
        }
      }
    }
  }

  return { outW, outH, outRgb, outRgba };
}

export function samplePixelArt(
  rgb: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  allX: number[],
  allY: number[],
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,
  nativeRes: boolean
): { outW: number; outH: number; outRgb: Uint8Array; outRgba?: Uint8Array } {
  const cellW = allX.length - 1;
  const cellH = allY.length - 1;

  const outW = nativeRes ? cellW : cellW * upscaleFactor;
  const outH = nativeRes ? cellH : cellH * upscaleFactor;
  const outRgb = new Uint8Array(outW * outH * 3);
  const outRgba = new Uint8Array(outW * outH * 4);

  function getRgba(x: number, y: number): [number, number, number, number] {
    const i = (y * width + x) * 4;
    return [rgb[i] || 0, rgb[i + 1] || 0, rgb[i + 2] || 0, rgb[i + 3] || 0];
  }

  for (let i = 0; i < cellW; i++) {
    const x1 = allX[i]!;
    const x2 = allX[i + 1]!;
    const cx = ((x1 + x2) / 2) | 0;

    for (let j = 0; j < cellH; j++) {
      const y1 = allY[j]!;
      const y2 = allY[j + 1]!;
      const cy = ((y1 + y2) / 2) | 0;

      let r = 0, g = 0, b = 0, a = 255;

      if (mode === "center") {
        [r, g, b, a] = getRgba(cx, cy);
      } else if (mode === "average") {
        let cnt = 0;
        for (let y = y1; y < y2; y++) {
          for (let x = x1; x < x2; x++) {
            const [rr, gg, bb, aa] = getRgba(x, y);
            r += rr; g += gg; b += bb; a += aa; cnt++;
          }
        }
        if (cnt > 0) {
          r = (r / cnt) | 0; g = (g / cnt) | 0; b = (b / cnt) | 0; a = (a / cnt) | 0;
        }
      } else {
        const cw = x2 - x1;
        const ch = y2 - y1;
        const ww = Math.max(1, (cw * weightRatio) | 0);
        const hh = Math.max(1, (ch * weightRatio) | 0);
        const wx1 = Math.max(0, cx - (ww >> 1));
        const wx2 = Math.min(width, cx + (ww >> 1));
        const wy1 = Math.max(0, cy - (hh >> 1));
        const wy2 = Math.min(height, cy + (hh >> 1));
        let cnt = 0;
        for (let y = wy1; y < wy2; y++) {
          for (let x = wx1; x < wx2; x++) {
            const [rr, gg, bb, aa] = getRgba(x, y);
            r += rr; g += gg; b += bb; a += aa; cnt++;
          }
        }
        if (cnt > 0) {
          r = (r / cnt) | 0; g = (g / cnt) | 0; b = (b / cnt) | 0; a = (a / cnt) | 0;
        }
      }

      if (nativeRes) {
        const o = (j * outW + i) * 3;
        const o4 = (j * outW + i) * 4;
        outRgb[o] = r; outRgb[o + 1] = g; outRgb[o + 2] = b;
        outRgba[o4] = r; outRgba[o4 + 1] = g; outRgba[o4 + 2] = b; outRgba[o4 + 3] = a;
      } else {
        const ox = i * upscaleFactor;
        const oy = j * upscaleFactor;
        for (let yy = 0; yy < upscaleFactor; yy++) {
          for (let xx = 0; xx < upscaleFactor; xx++) {
            const o = ((oy + yy) * outW + (ox + xx)) * 3;
            const o4 = ((oy + yy) * outW + (ox + xx)) * 4;
            outRgb[o] = r; outRgb[o + 1] = g; outRgb[o + 2] = b;
            outRgba[o4] = r; outRgba[o4 + 1] = g; outRgba[o4 + 2] = b; outRgba[o4 + 3] = a;
          }
        }
      }
    }
  }

  return { outW, outH, outRgb, outRgba };
}
