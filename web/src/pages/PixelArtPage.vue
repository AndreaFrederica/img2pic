<template>
  <q-page class="q-pa-md">
    <!-- 大屏幕水平布局：控制面板和图片区域并排 -->
    <div class="horizontal-layout">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">像素化设置</div>

            <!-- 文件上传 -->
            <q-file
              v-model="selectedFile"
              label="选择图片"
              accept="image/*"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>

            <!-- 像素化参数 -->
            <q-expansion-item
              label="像素化参数"
              default-opened
              class="q-mb-md"
            >
              <q-card flat bordered class="q-pa-md">
                <!-- 能量算法参数（仅在非直接采样模式时显示） -->
                <template v-if="!useDirectSampling">
                  <div class="text-subtitle2 q-mb-md">能量算法参数</div>

                  <!-- 基础参数 -->
                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">高斯模糊 (σ): {{ params.sigma.toFixed(1) }}</div>
                    <q-slider
                      v-model="params.sigma"
                      :min="0"
                      :max="5"
                      :step="0.1"
                      label
                      label-always
                      class="q-mb-md"
                    />
                  </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">间隙容忍度: {{ params.gapTolerance }}</div>
                  <q-slider
                    v-model="params.gapTolerance"
                    :min="0"
                    :max="10"
                    label
                    label-always
                    class="q-mb-md"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">最小能量阈值: {{ params.minEnergy.toFixed(2) }}</div>
                  <q-slider
                    v-model="params.minEnergy"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    label
                    label-always
                    class="q-mb-md"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">平滑窗口大小: {{ params.smooth }}</div>
                  <q-slider
                    v-model="params.smooth"
                    :min="1"
                    :max="15"
                    label
                    label-always
                    class="q-mb-md"
                  />
                </div>

                <!-- 能量增强选项 -->
                <q-toggle
                  v-model="params.enhanceEnergy"
                  label="启用能量增强"
                  class="q-mb-md"
                />

                <template v-if="params.enhanceEnergy">
                  <q-toggle
                    v-model="params.enhanceDirectional"
                    label="方向性增强"
                    class="q-mb-md"
                  />

                  <template v-if="params.enhanceDirectional">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">水平增强倍数: {{ params.enhanceHorizontal.toFixed(1) }}</div>
                      <q-slider
                        v-model="params.enhanceHorizontal"
                        :min="0.5"
                        :max="3"
                        :step="0.1"
                        label
                        label-always
                        class="q-mb-md"
                      />
                    </div>

                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">垂直增强倍数: {{ params.enhanceVertical.toFixed(1) }}</div>
                      <q-slider
                        v-model="params.enhanceVertical"
                        :min="0.5"
                        :max="3"
                        :step="0.1"
                        label
                        label-always
                        class="q-mb-md"
                      />
                    </div>
                  </template>
                </template>
              </template>

                <!-- 像素大小检测 -->
                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    像素大小:
                    <span v-if="useDirectSampling">{{ params.pixelSize || 8 }}px (手动设置)</span>
                    <span v-else>{{ params.pixelSize === 0 ? '自动检测' : params.pixelSize + 'px' }}</span>
                  </div>
                  <q-slider
                    v-model="params.pixelSize"
                    :min="useDirectSampling ? 1 : 0"
                    :max="useDirectSampling ? 50 : 20"
                    label
                    label-always
                    class="q-mb-md"
                  />
                </div>

                <template v-if="!useDirectSampling && params.pixelSize === 0">
                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">最小像素大小: {{ params.minS }}</div>
                    <q-slider
                      v-model="params.minS"
                      :min="2"
                      :max="8"
                      label
                      label-always
                      class="q-mb-md"
                    />
                  </div>

                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">最大像素大小: {{ params.maxS }}</div>
                    <q-slider
                      v-model="params.maxS"
                      :min="10"
                      :max="40"
                      label
                      label-always
                      class="q-mb-md"
                    />
                  </div>
                </template>

                <!-- 采样模式选择 -->
                <div class="text-subtitle2 q-mb-md">采样模式</div>

                <q-toggle
                  v-model="params.sample"
                  label="生成像素画"
                  class="q-mb-md"
                />

                <template v-if="params.sample">
                  <q-toggle
                    v-model="useDirectSampling"
                    label="直接按比例采样（适用于普通图片）"
                    class="q-mb-md"
                  />

                  <template v-if="!useDirectSampling">
                    <q-select
                      v-model="params.sampleMode"
                      :options="sampleModeOptions.filter(opt => opt.value !== 'direct')"
                      label="能量图采样模式"
                      emit-value
                      map-options
                      class="q-mb-md"
                    />
                  </template>

                  <q-toggle
                    v-model="params.nativeRes"
                    label="原生分辨率 (1像素=1格)"
                    class="q-mb-md"
                  />

                  <template v-if="!params.nativeRes">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">放大倍数: {{ params.upscale === 0 ? '自动' : params.upscale }}</div>
                      <q-slider
                        v-model="params.upscale"
                        :min="0"
                        :max="10"
                        label
                        label-always
                        class="q-mb-md"
                      />
                    </div>
                  </template>

                  <template v-if="!useDirectSampling && params.sampleMode === 'weighted'">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">加权比例: {{ params.sampleWeightRatio.toFixed(1) }}</div>
                      <q-slider
                        v-model="params.sampleWeightRatio"
                        :min="0.1"
                        :max="0.9"
                        :step="0.1"
                        label
                        label-always
                        class="q-mb-md"
                      />
                    </div>
                  </template>

                  <template v-if="useDirectSampling">
                    <q-separator class="q-my-md" />
                    <div class="text-subtitle2 q-mb-md">直接采样参数</div>

                    <q-banner class="bg-grey-2 text-grey-8 q-mb-md">
                      <template v-slot:avatar>
                        <q-icon name="info" />
                      </template>
                      直接采样模式适用于普通图片转换为像素画。需要手动设置像素大小。
                    </q-banner>
                  </template>
                </template>
              </q-card>
            </q-expansion-item>

            <!-- 处理按钮 -->
            <q-btn
              color="primary"
              label="开始处理"
              @click="processImage"
              :loading="processing"
              :disable="!selectedFile || processing"
              class="full-width q-mb-md"
            />

            <!-- 显示调试信息 -->
            <q-toggle
              v-model="showDebug"
              label="显示能量图和网格线"
              class="q-mb-md"
            />

            <!-- 状态信息 -->
            <div v-if="result" class="text-body2 text-grey-7">
              <div class="q-mb-sm">检测到像素大小: {{ result.detectedPixelSize }}px</div>
              <div class="q-mb-sm">检测到网格线: {{ result.xLines.length }} × {{ result.yLines.length }}</div>
              <div v-if="result.pixelArt">
                <div>输出尺寸: {{ result.pixelArt.width }} × {{ result.pixelArt.height }}</div>
                <div>放大倍数: {{ result.pixelArt.upscaleFactor }}x</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 右侧图片显示区域 -->
      <div class="image-display-area">
        <!-- 大屏幕水平布局：所有图片在一行 -->
        <div class="image-grid">
          <!-- 原始图片 -->
          <div class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">原始图片</div>
                <div v-if="imageLoaded" class="text-center">
                  <canvas ref="originalCanvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(originalCanvas, '原始图片')" />
                </div>
                <div v-else class="text-center text-grey-6 q-pa-lg">
                  请选择要处理的图片
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 纯能量图（调试模式） -->
          <div v-if="showDebug && result" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">纯能量图</div>
                <div class="text-center">
                  <canvas ref="energyCanvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(energyCanvas, '纯能量图')" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 能量图和网格线（调试模式） -->
          <div v-if="showDebug && result" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">能量图和网格线</div>
                <div class="text-center">
                  <canvas ref="debugCanvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(debugCanvas, '能量图和网格线')" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 像素化结果 -->
          <div v-if="result && result.pixelArt" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">像素化结果</div>
                <div class="text-center">
                  <canvas ref="pixelCanvas" style="max-width: 100%; height: auto; cursor: pointer; background: repeating-conic-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 25%); background-color: transparent;" @click="openImagePreview(pixelCanvas, '像素化结果')" />
                  <div class="q-mt-md">
                    <q-btn
                      color="secondary"
                      label="下载纯能量图"
                      @click="downloadEnergy"
                      icon="download"
                      class="q-mr-md"
                      v-if="showDebug"
                    />
                    <q-btn
                      color="secondary"
                      label="下载能量图+网格"
                      @click="downloadDebug"
                      icon="download"
                      class="q-mr-md"
                      v-if="showDebug"
                    />
                    <q-btn
                      color="secondary"
                      label="下载像素画"
                      @click="downloadPixelArt"
                      icon="download"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览器对话框 -->
    <q-dialog v-model="imagePreviewDialog" maximized>
      <q-card class="image-preview-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ previewImageName }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="image-preview-container">
          <InlineImageViewer
            :src="previewImageSrc"
            :name="previewImageName"
            style="width: 100%; height: 100%;"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useQuasar } from 'quasar';
import { saveAs } from 'file-saver';
import UPNG from 'upng-js';
import { createPixelWorker } from 'src/pixel/workerApi';
import type { PipelineParams, PipelineResult } from 'src/pixel/types';
import InlineImageViewer from 'src/components/InlineImageViewer.vue';

const $q = useQuasar();

// 状态变量
const selectedFile = ref<File | null>(null);
const originalCanvas = ref<HTMLCanvasElement | null>(null);
const imageLoaded = ref(false);
const energyCanvas = ref<HTMLCanvasElement | null>(null);
const debugCanvas = ref<HTMLCanvasElement | null>(null);
const pixelCanvas = ref<HTMLCanvasElement | null>(null);
const processing = ref(false);
const showDebug = ref(true); // 默认开启调试模式，方便查看能量图和网格线
const result = ref<PipelineResult | null>(null);
let workerInstance: ReturnType<typeof createPixelWorker> | null = null;

// 图片预览器状态
const imagePreviewDialog = ref(false);
const previewImageSrc = ref('');
const previewImageName = ref('');

// 直接采样模式开关
const useDirectSampling = ref(false);

// 能量算法参数
const params = reactive<PipelineParams>({
  sigma: 1.0,
  enhanceEnergy: false,
  enhanceDirectional: false,
  enhanceHorizontal: 1.0,
  enhanceVertical: 1.0,
  gapTolerance: 2,
  minEnergy: 0.15,
  smooth: 3,
  windowSize: 0,
  pixelSize: 0,
  minS: 4,
  maxS: 24,
  sample: true,
  sampleMode: 'center',
  sampleWeightRatio: 0.6,
  upscale: 0,
  nativeRes: false,
});

// 采样模式选项
const sampleModeOptions = [
  { label: '中心采样', value: 'center' },
  { label: '平均采样', value: 'average' },
  { label: '加权平均', value: 'weighted' },
  { label: '直接按比例采样（普通图片）', value: 'direct' },
];

// 监听直接采样模式切换
watch(useDirectSampling, (newValue) => {
  if (newValue) {
    params.sampleMode = 'direct';
    // 切换到直接采样模式时，设置默认像素大小
    if (params.pixelSize === 0) {
      params.pixelSize = 8;
    }
  } else {
    // 切换回其他模式时，默认选择中心采样
    if (params.sampleMode === 'direct') {
      params.sampleMode = 'center';
    }
  }
});

// 初始化Worker
onMounted(() => {
  console.log('Component mounted, creating worker');
  workerInstance = createPixelWorker();
  console.log('Worker created', !!workerInstance);
});

onUnmounted(() => {
  if (workerInstance) {
    workerInstance.worker.terminate();
  }
});

// 监听文件变化
watch(selectedFile, async (file) => {
  console.log('File changed', { file: file?.name });

  if (!file) {
    console.log('Early return: no file');
    imageLoaded.value = false;
    return;
  }

  // 先标记为已加载，这样canvas会被渲染
  imageLoaded.value = true;

  // 使用nextTick确保DOM已渲染，canvas元素可用
  await nextTick();

  if (!originalCanvas.value) {
    console.log('Early return: canvas not available after nextTick');
    imageLoaded.value = false;
    return;
  }

  const img = new Image();
  img.onload = () => {
    console.log('Image loaded', { width: img.width, height: img.height });
    // 调整canvas大小
    originalCanvas.value!.width = img.width;
    originalCanvas.value!.height = img.height;

    // 绘制图片
    const ctx = originalCanvas.value!.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    console.log('Image drawn to canvas');

    // 重置结果
    result.value = null;
  };
  img.onerror = () => {
    console.error('Failed to load image');
    imageLoaded.value = false;
  };
  img.src = URL.createObjectURL(file);
});

// 处理图片
async function processImage() {
  console.log('processImage called', { selectedFile: selectedFile.value, originalCanvas: !!originalCanvas.value });
  if (!selectedFile.value || !originalCanvas.value) {
    console.log('Early return: missing file or image');
    return;
  }

  processing.value = true;
  console.log('Processing started');

  try {
    // 获取图片数据
    const ctx = originalCanvas.value.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, originalCanvas.value.width, originalCanvas.value.height);

    // 准备输入数据
    const input = {
      width: originalCanvas.value.width,
      height: originalCanvas.value.height,
      rgba: imageData.data.buffer,
    };

    // 将 reactive params 转换为普通对象，以便 Comlink 可以序列化
    const plainParams = JSON.parse(JSON.stringify(params));

    console.log('Input data:', {
      width: input.width,
      height: input.height,
      rgba: input.rgba.byteLength,
      params: plainParams
    });

    // 调用Worker处理
    const resultData = await workerInstance!.api.runPipeline(input, plainParams);

    console.log('Worker result:', resultData);
    console.log('Show debug:', showDebug.value);
    console.log('Has pixel art:', !!resultData.pixelArt);
    if (resultData.pixelArt) {
      console.log('Pixel art data:', {
        width: resultData.pixelArt.width,
        height: resultData.pixelArt.height,
        upscaleFactor: resultData.pixelArt.upscaleFactor
      });
    }

    // 保存结果
    result.value = resultData;

    // 显示像素画
    if (resultData.pixelArt) {
      console.log('Rendering pixel art...');
      // 使用 nextTick 确保 pixelCanvas 元素已渲染
      await nextTick();
      console.log('pixelCanvas available:', !!pixelCanvas.value);
      renderPixelArt();
    } else {
      console.log('No pixel art data to render');
    }

    // 如果调试模式开启，再次确保 Canvas 已渲染
    if (showDebug.value) {
      console.log('Ensuring debug canvases are rendered...');
      await nextTick();
      console.log('energyCanvas available after nextTick:', !!energyCanvas.value);
      console.log('debugCanvas available after nextTick:', !!debugCanvas.value);
      if (energyCanvas.value) {
        renderEnergyImage();
      }
      if (debugCanvas.value) {
        renderDebugImage();
      }
    }

    $q.notify({
      type: 'positive',
      message: '处理完成！',
    });
  } catch (error) {
    console.error('处理错误:', error);
    $q.notify({
      type: 'negative',
      message: '处理失败：' + String(error),
    });
  } finally {
    processing.value = false;
  }
}

// 渲染纯能量图（没有网格线和绿点）
function renderEnergyImage() {
  if (!result.value || !energyCanvas.value) return;

  const { width, height, energyU8 } = result.value;

  energyCanvas.value.width = width;
  energyCanvas.value.height = height;

  const ctx = energyCanvas.value.getContext('2d')!;

  // 绘制能量图（灰度）
  console.log('Drawing pure energy map...');
  const energyData = new Uint8Array(energyU8);
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < energyData.length; i++) {
    const value = energyData[i] || 0;
    const idx = i * 4;
    imageData.data[idx] = value;     // R
    imageData.data[idx + 1] = value; // G
    imageData.data[idx + 2] = value; // B
    imageData.data[idx + 3] = 255;   // A
  }

  ctx.putImageData(imageData, 0, 0);
  console.log('Pure energy image rendering completed');
}

// 渲染调试图像（能量图+网格线）
function renderDebugImage() {
  if (!result.value || !debugCanvas.value) return;

  const { width, height, energyU8, xLines, yLines, allXLines, allYLines } = result.value;

  debugCanvas.value.width = width;
  debugCanvas.value.height = height;

  const ctx = debugCanvas.value.getContext('2d')!;

  // 绘制能量图（灰度）
  console.log('Drawing energy map...');
  const energyData = new Uint8Array(energyU8);
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < energyData.length; i++) {
    const value = energyData[i] || 0;
    const idx = i * 4;
    imageData.data[idx] = value;     // R
    imageData.data[idx + 1] = value; // G
    imageData.data[idx + 2] = value; // B
    imageData.data[idx + 3] = 255;   // A
  }

  ctx.putImageData(imageData, 0, 0);
  console.log('Energy image data drawn to canvas');

  // 绘制检测到的网格线（红色）
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  console.log('Starting to draw detected grid lines...', { xLines: xLines.length, yLines: yLines.length });

  for (const x of xLines) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (const y of yLines) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  console.log('Detected grid lines drawn');

  // 绘制插值后的网格线（蓝色）
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;
  console.log('Starting to draw interpolated grid lines...', { allXLines: allXLines.length, allYLines: allYLines.length });

  for (const x of allXLines) {
    if (!xLines.includes(x)) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }

  for (const y of allYLines) {
    if (!yLines.includes(y)) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  console.log('Interpolated grid lines drawn');

  // 绘制网格中心点（绿色）
  ctx.fillStyle = 'green';
  console.log('Starting to draw grid center points...');
  let centerPointCount = 0;
  for (let i = 0; i < allXLines.length - 1; i++) {
    const x = (allXLines[i]! + allXLines[i + 1]!) / 2;
    for (let j = 0; j < allYLines.length - 1; j++) {
      const y = (allYLines[j]! + allYLines[j + 1]!) / 2;
      ctx.fillRect(x - 1, y - 1, 2, 2);
      centerPointCount++;
    }
  }
  console.log('Debug image rendering completed', { centerPointCount });
}

// 渲染像素画
function renderPixelArt() {
  if (!result.value?.pixelArt || !pixelCanvas.value) return;

  const { width, height, rgb, rgba } = result.value.pixelArt;

  pixelCanvas.value.width = width;
  pixelCanvas.value.height = height;

  const ctx = pixelCanvas.value.getContext('2d')!;

  // 创建图像数据
  const imageData = ctx.createImageData(width, height);

  if (rgba) {
    // 如果有RGBA数据，使用透明度
    const rgbaData = new Uint8Array(rgba);
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      imageData.data[idx] = rgbaData[idx] || 0;         // R
      imageData.data[idx + 1] = rgbaData[idx + 1] || 0; // G
      imageData.data[idx + 2] = rgbaData[idx + 2] || 0; // B
      imageData.data[idx + 3] = rgbaData[idx + 3] || 255; // A
    }
  } else {
    // 否则使用RGB数据，默认不透明
    const rgbData = new Uint8Array(rgb);
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      const rgbIdx = i * 3;
      imageData.data[idx] = rgbData[rgbIdx] || 0;         // R
      imageData.data[idx + 1] = rgbData[rgbIdx + 1] || 0; // G
      imageData.data[idx + 2] = rgbData[rgbIdx + 2] || 0; // B
      imageData.data[idx + 3] = 255;                  // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // 如果是像素画，禁用图像平滑以获得清晰的像素效果
  ctx.imageSmoothingEnabled = false;

  // 调试：检查透明度数据
  if (rgba) {
    const rgbaData = new Uint8Array(rgba);
    let transparentPixels = 0;
    let totalPixels = 0;
    for (let i = 0; i < rgbaData.length; i += 4) {
      totalPixels++;
      const alpha = rgbaData[i + 3];
      if (alpha !== undefined && alpha < 128) transparentPixels++;
    }
    console.log(`像素画渲染调试: 总像素=${totalPixels}, 透明像素=${transparentPixels}, 透明比例=${(transparentPixels/totalPixels*100).toFixed(1)}%`);
  }
}

// 下载纯能量图
function downloadEnergy() {
  if (!energyCanvas.value) return;

  energyCanvas.value.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `energy_${Date.now()}.png`);
    }
  }, 'image/png');
}

// 下载调试图像（能量图+网格线）
function downloadDebug() {
  if (!debugCanvas.value) return;

  debugCanvas.value.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `energy_debug_${Date.now()}.png`);
    }
  }, 'image/png');
}

// 下载像素画
function downloadPixelArt() {
  if (!result.value?.pixelArt) return;

  const { width, height, rgba, rgb } = result.value.pixelArt;

  // 如果有 RGBA 数据，直接从原始数据生成 PNG
  if (rgba) {
    const rgbaData = new Uint8Array(rgba);

    console.log(`下载调试: width=${width}, height=${height}, rgba长度=${rgbaData.length}, 期望长度=${width * height * 4}`);

    // 确保数据长度正确
    const expectedLength = width * height * 4;
    const correctedData = rgbaData.length === expectedLength ? rgbaData : new Uint8Array(expectedLength);

    if (rgbaData.length !== expectedLength) {
      console.log(`数据长度不匹配，需要修正: 实际=${rgbaData.length}, 期望=${expectedLength}`);
      // 如果长度不匹配，复制可用的数据
      const copyLength = Math.min(rgbaData.length, expectedLength);
      for (let i = 0; i < copyLength; i++) {
        const value = rgbaData[i];
        correctedData[i] = value !== undefined ? value : 0;
      }
      // 填充剩余的透明像素
      for (let i = copyLength; i < expectedLength; i++) {
        correctedData[i] = i % 4 === 3 ? 0 : 255; // Alpha=0, RGB=255
      }
    }

    // 检查前几个像素的数据
    console.log(`前16个字节数据:`, Array.from(correctedData.slice(0, 16)));

    // 查找第一个非透明像素
    let firstNonTransparentIndex = -1;
    for (let i = 0; i < correctedData.length; i += 4) {
      const alpha = correctedData[i + 3];
      if (alpha !== undefined && alpha > 0) {
        firstNonTransparentIndex = i;
        break;
      }
    }
    if (firstNonTransparentIndex >= 0) {
      const pixelIndex = firstNonTransparentIndex / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      console.log(`第一个非透明像素位置: 索引${pixelIndex}, 坐标(${x},${y}), RGBA:`,
        Array.from(correctedData.slice(firstNonTransparentIndex, firstNonTransparentIndex + 4)));
    }

    // 统计非透明像素
    let nonTransparentPixels = 0;
    for (let i = 0; i < correctedData.length; i += 4) {
      const alpha = correctedData[i + 3];
      if (alpha !== undefined && alpha > 0) nonTransparentPixels++;
    }
    console.log(`非透明像素数量: ${nonTransparentPixels}/${width * height}`);

    // 使用正确的 upng-js 编码方式：传入 ArrayBuffer
    let pngData: Uint8Array | undefined;

    try {
      // 关键：传入 ArrayBuffer，不是 Uint8Array
      pngData = UPNG.encode([correctedData.buffer.slice(correctedData.byteOffset, correctedData.byteOffset + correctedData.byteLength)], width, height, 0);
      console.log(`PNG编码结果: ${pngData?.length || 'undefined'}`);
    } catch (e) {
      console.error('PNG编码失败:', e);
    }

    if (!pngData || pngData.length === 0) {
      console.error('PNG编码失败，回退到Canvas方法');
      // 回退到Canvas方法
      if (pixelCanvas.value) {
        pixelCanvas.value.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `pixel_art_${Date.now()}.png`);
          }
        }, 'image/png');
      }
      return;
    }

    console.log(`PNG编码成功, 数据长度: ${pngData.length}`);

    // 创建 Blob 并下载
    const blob = new Blob([pngData as BlobPart], { type: 'image/png' });
    saveAs(blob, `pixel_art_${Date.now()}.png`);
  } else if (rgb) {
    // 如果只有 RGB 数据，转换为 RGBA（不透明）
    const rgbData = new Uint8Array(rgb);
    const rgbaData = new Uint8Array(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const rgbIdx = i * 3;
      const rgbaIdx = i * 4;
      rgbaData[rgbaIdx] = rgbData[rgbIdx] || 0;         // R
      rgbaData[rgbaIdx + 1] = rgbData[rgbIdx + 1] || 0; // G
      rgbaData[rgbaIdx + 2] = rgbData[rgbIdx + 2] || 0; // B
      rgbaData[rgbaIdx + 3] = 255;                      // A (不透明)
    }

    // 使用 upng-js 编码 PNG
    const pngData = UPNG.encode([rgbaData as ArrayBuffer], width, height, 0, 6);

    // 创建 Blob 并下载
    const blob = new Blob([pngData as BlobPart], { type: 'image/png' });
    saveAs(blob, `pixel_art_${Date.now()}.png`);
  }
}

// 从 RGBA 数据生成 PNG data URL
function createPngDataUrl(width: number, height: number, rgbaData: Uint8Array): string {
  // 确保数据长度正确
  const expectedLength = width * height * 4;
  const correctedData = rgbaData.length === expectedLength ? rgbaData : new Uint8Array(expectedLength);

  if (rgbaData.length !== expectedLength) {
    // 如果长度不匹配，复制可用的数据
    const copyLength = Math.min(rgbaData.length, expectedLength);
    for (let i = 0; i < copyLength; i++) {
      const value = rgbaData[i];
      correctedData[i] = value !== undefined ? value : 0;
    }
    // 填充剩余的透明像素
    for (let i = copyLength; i < expectedLength; i++) {
      correctedData[i] = i % 4 === 3 ? 0 : 255; // Alpha=0, RGB=255
    }
  }

  // 使用正确的 upng-js 编码方式：传入 ArrayBuffer
  const arrayBuffer = correctedData.buffer.slice(correctedData.byteOffset, correctedData.byteOffset + correctedData.byteLength) as ArrayBuffer;
  const pngData = UPNG.encode([arrayBuffer], width, height, 0);
  const blob = new Blob([pngData as BlobPart], { type: 'image/png' });
  return URL.createObjectURL(blob);
}

// 打开图片预览器
function openImagePreview(canvas: HTMLCanvasElement | null, imageName: string) {
  if (!canvas) return;

  // 如果是像素画预览，并且有 RGBA 数据，直接从原始数据生成
  if (imageName === '像素化结果' && result.value?.pixelArt?.rgba) {
    const { width, height, rgba } = result.value.pixelArt;
    const rgbaData = new Uint8Array(rgba);
    previewImageName.value = imageName;
    previewImageSrc.value = createPngDataUrl(width, height, rgbaData);
    imagePreviewDialog.value = true;
  } else {
    // 其他情况使用 canvas
    previewImageName.value = imageName;
    previewImageSrc.value = canvas.toDataURL();
    imagePreviewDialog.value = true;
  }
}
</script>

<style scoped>
/* 强制水平布局 */
.horizontal-layout {
  display: flex !important;
  flex-direction: row !important;
  gap: 1rem;
  width: 100%;
  min-height: 600px;
}

.control-panel {
  flex: 0 0 35%;
  min-width: 350px;
  max-width: 400px;
}

.image-display-area {
  flex: 1;
  min-width: 0;
}

.image-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.image-card {
  flex: 1;
  min-width: 200px;
}

/* 图片预览器样式 */
.image-preview-dialog {
  width: 100%;
  height: 100%;
}

.image-preview-container {
  padding: 0;
  height: calc(100vh - 60px);
}

/* 响应式：小屏幕时切换为垂直布局 */
@media (max-width: 768px) {
  .horizontal-layout {
    flex-direction: column !important;
  }

  .control-panel {
    flex: 1;
    max-width: none;
    min-width: auto;
  }

  .image-grid {
    flex-direction: column;
  }
}
</style>
