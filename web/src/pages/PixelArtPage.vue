<template>
  <q-page class="q-pa-md">
    <!-- 大屏幕水平布局：控制面板和图片区域并排 -->
    <div class="horizontal-layout">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('title.pixelSettings') }}</div>

            <!-- 文件上传 -->
            <q-file
              v-model="selectedFile"
              :label="$t('fileUpload.selectImage')"
              accept="image/*"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>

            <!-- 预处理插值 -->
            <div class="q-mb-md">
              <div class="text-body2 q-mb-sm">
                {{ $t('pixelParams.preprocessInterp') }}: {{ preprocessInterpFactor }}x
                <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                  <q-tooltip>{{ $t('pixelParams.preprocessInterpDesc') }}</q-tooltip>
                </q-icon>
              </div>
              <q-slider
                v-model="preprocessInterpFactor"
                :min="1"
                :max="10"
                :step="0.5"
                label
              />
            </div>

            <!-- 快速处理按钮 -->
            <q-btn
              color="primary"
              :label="$t('actions.startProcessing')"
              @click="processImage"
              :loading="processing"
              :disable="!selectedFile || processing"
              class="full-width q-mb-md"
              size="lg"
            />

            <!-- 模式选择 -->
            <div class="text-subtitle2 q-mb-md">{{ $t('samplingMode.mode') || '处理模式' }}</div>
            <q-option-group
              v-model="processingMode"
              :options="processingModeOptions"
              color="primary"
              class="q-mb-md"
            >
              <template v-slot:label="opt">
                <div class="row items-center">
                  <div>{{ opt.label }}</div>
                  <q-icon
                    name="help"
                    size="xs"
                    color="primary"
                    class="q-ml-xs cursor-pointer"
                  >
                    <q-tooltip>{{ opt.description }}</q-tooltip>
                  </q-icon>
                </div>
              </template>
            </q-option-group>

            <!-- WASM 加速设置 -->
            <WasmSettings />

            <!-- 能量算法参数 (仅在能量算法模式下显示) -->
            <q-expansion-item
              v-if="processingMode === 'energy'"
              :label="$t('pixelParams.title')"
              default-opened
              class="q-mb-md"
            >
              <q-card flat bordered class="q-pa-md">
                <!-- 能量算法参数 -->
                <div class="text-subtitle2 q-mb-md">{{ $t('pixelParams.energyAlgorithmParams') }}</div>

                <!-- 基础参数 -->
                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">
                      {{ $t('pixelParams.gaussianBlur') }}: {{ params.sigma.toFixed(1) }}
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                        <q-tooltip>{{ $t('pixelParams.gaussianBlurDesc') }}</q-tooltip>
                      </q-icon>
                    </div>
                    <q-slider
                      v-model="params.sigma"
                      :min="0"
                      :max="5"
                      :step="0.1"
                      label
                      class="q-mb-md"
                    />
                  </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    {{ $t('pixelParams.gapTolerance') }}: {{ params.gapTolerance }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>{{ $t('pixelParams.gapToleranceDesc') }}</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="params.gapTolerance"
                    :min="0"
                    :max="10"
                    label
                    class="q-mb-md"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    {{ $t('pixelParams.interpThreshold') }}: {{ params.interpThreshold.toFixed(2) }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>{{ $t('pixelParams.interpThresholdDesc') }}</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="params.interpThreshold"
                    :min="0.5"
                    :max="5"
                    :step="0.05"
                    label
                    class="q-mb-md"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    {{ $t('pixelParams.minEnergyThreshold') }}: {{ params.minEnergy.toFixed(2) }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>{{ $t('pixelParams.minEnergyThresholdDesc') }}</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="params.minEnergy"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    label
                    class="q-mb-md"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    {{ $t('pixelParams.smoothWindowSize') }}: {{ params.smooth }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>{{ $t('pixelParams.smoothWindowSizeDesc') }}</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="params.smooth"
                    :min="1"
                    :max="15"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 能量增强选项 -->
                <q-toggle
                  v-model="params.enhanceEnergy"
                  class="q-mb-md"
                >
                  <template v-slot:default>
                    <span class="flex items-center">
                      {{ $t('pixelParams.enableEnergyEnhancement') }}
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                        <q-tooltip>{{ $t('pixelParams.enableEnergyEnhancementDesc') }}</q-tooltip>
                      </q-icon>
                    </span>
                  </template>
                </q-toggle>

                <template v-if="params.enhanceEnergy">
                  <q-toggle
                    v-model="params.enhanceDirectional"
                    class="q-mb-md"
                  >
                    <template v-slot:default>
                      <span class="flex items-center">
                        {{ $t('pixelParams.directionalEnhancement') }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                          <q-tooltip>{{ $t('pixelParams.directionalEnhancementDesc') }}</q-tooltip>
                        </q-icon>
                      </span>
                    </template>
                  </q-toggle>

                  <template v-if="params.enhanceDirectional">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">
                        {{ $t('pixelParams.horizontalEnhancement') }}: {{ params.enhanceHorizontal.toFixed(1) }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                          <q-tooltip>{{ $t('pixelParams.horizontalEnhancementDesc') }}</q-tooltip>
                        </q-icon>
                      </div>
                      <q-slider
                        v-model="params.enhanceHorizontal"
                        :min="0.5"
                        :max="3"
                        :step="0.1"
                        label
                        class="q-mb-md"
                      />
                    </div>

                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">
                        {{ $t('pixelParams.verticalEnhancement') }}: {{ params.enhanceVertical.toFixed(1) }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                          <q-tooltip>{{ $t('pixelParams.verticalEnhancementDesc') }}</q-tooltip>
                        </q-icon>
                      </div>
                      <q-slider
                        v-model="params.enhanceVertical"
                        :min="0.5"
                        :max="3"
                        :step="0.1"
                        label
                        class="q-mb-md"
                      />
                    </div>
                  </template>
                </template>

                <!-- 像素大小检测 -->
                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    {{ $t('pixelParams.pixelSize') }}:
                    <span v-if="useDirectSampling">{{ params.pixelSize || 8 }}px ({{ $t('pixelParams.manualSet') }})</span>
                    <span v-else>{{ params.pixelSize === 0 ? $t('pixelParams.autoDetect') : params.pixelSize + 'px' }}</span>
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>{{ $t('pixelParams.pixelSizeDesc') }}</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="params.pixelSize"
                    :min="useDirectSampling ? 1 : 0"
                    :max="useDirectSampling ? 50 : 20"
                    label
                    class="q-mb-md"
                  />
                </div>

                <template v-if="!useDirectSampling && params.pixelSize === 0">
                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">
                      {{ $t('pixelParams.minPixelSize') }}: {{ params.minS }}
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                        <q-tooltip>{{ $t('pixelParams.minPixelSizeDesc') }}</q-tooltip>
                      </q-icon>
                    </div>
                    <q-slider
                      v-model="params.minS"
                      :min="2"
                      :max="8"
                      label
                      class="q-mb-md"
                    />
                  </div>

                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">
                      {{ $t('pixelParams.maxPixelSize') }}: {{ params.maxS }}
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                        <q-tooltip>{{ $t('pixelParams.maxPixelSizeDesc') }}</q-tooltip>
                      </q-icon>
                    </div>
                    <q-slider
                      v-model="params.maxS"
                      :min="10"
                      :max="40"
                      label
                      class="q-mb-md"
                    />
                  </div>
                </template>


                <!-- 采样模式选择 (仅在能量算法模式下显示) -->
                <template v-if="processingMode === 'energy'">
                  <div class="text-subtitle2 q-mb-md">{{ $t('samplingMode.title') }}</div>

                  <q-toggle
                    v-model="params.sample"
                    class="q-mb-md"
                  >
                    <template v-slot:default>
                      <span class="flex items-center">
                        {{ $t('samplingMode.generatePixelArt') }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                          <q-tooltip>{{ $t('samplingMode.generatePixelArtDesc') }}</q-tooltip>
                        </q-icon>
                      </span>
                    </template>
                  </q-toggle>

                  <template v-if="params.sample">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">
                        {{ $t('samplingMode.energyMapSampling') }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                          <q-tooltip>{{ $t('samplingMode.energyMapSamplingDesc') }}</q-tooltip>
                        </q-icon>
                      </div>
                      <q-select
                        v-model="params.sampleMode"
                        :options="sampleModeOptions.filter(opt => opt.value !== 'direct')"
                        emit-value
                        map-options
                      />
                    </div>
                  </template>

                  <q-toggle
                    v-model="params.nativeRes"
                    class="q-mb-md"
                  >
                    <template v-slot:default>
                      <span class="flex items-center">
                        {{ $t('samplingMode.nativeResolution') }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                          <q-tooltip>{{ $t('samplingMode.nativeResolutionDesc') }}</q-tooltip>
                        </q-icon>
                      </span>
                    </template>
                  </q-toggle>

                  <template v-if="!params.nativeRes">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">
                        {{ $t('samplingMode.upscaleFactor') }}: {{ params.upscale === 0 ? $t('samplingMode.auto') : params.upscale }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                          <q-tooltip>{{ $t('samplingMode.upscaleFactorDesc') }}</q-tooltip>
                        </q-icon>
                      </div>
                      <q-slider
                        v-model="params.upscale"
                        :min="0"
                        :max="10"
                        label
                        class="q-mb-md"
                      />
                    </div>
                  </template>

                  <template v-if="!useDirectSampling && params.sampleMode === 'weighted'">
                    <div class="q-mb-md">
                      <div class="text-body2 q-mb-sm">
                        {{ $t('samplingMode.weightedRatio') }}: {{ params.sampleWeightRatio.toFixed(1) }}
                        <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                          <q-tooltip>{{ $t('samplingMode.weightedRatioDesc') }}</q-tooltip>
                        </q-icon>
                      </div>
                      <q-slider
                        v-model="params.sampleWeightRatio"
                        :min="0.1"
                        :max="0.9"
                        :step="0.1"
                        label
                        class="q-mb-md"
                      />
                    </div>
                  </template>
                </template>
              </q-card>
            </q-expansion-item>

            <!-- 显示调试信息 - 只在能量算法模式下显示 -->
            <q-toggle
              v-if="processingMode === 'energy'"
              v-model="showDebug"
              class="q-mb-md"
            >
              <template v-slot:default>
                <span class="flex items-center">
                  {{ $t('actions.showEnergyMapAndGrid') }}
                  <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                    <q-tooltip>{{ $t('actions.showEnergyMapAndGridDesc') }}</q-tooltip>
                  </q-icon>
                </span>
              </template>
            </q-toggle>

            <!-- 纯比例放大倍数 (仅在纯比例放大模式下显示) -->
            <div v-if="processingMode === 'pureUpscale'" class="q-mb-md">
              <div class="text-body2 q-mb-sm">
                {{ $t('samplingMode.upscaleFactor') }}: {{ pureUpscaleFactor }}x
              </div>
              <q-slider
                v-model="pureUpscaleFactor"
                :min="1"
                :max="20"
                :step="1"
                label
              />
            </div>

            <!-- 直接采样模式参数面板 -->
            <q-expansion-item
              v-if="processingMode === 'directSampling'"
              :label="$t('pixelParams.title')"
              default-opened
              class="q-mb-md"
            >
              <q-card flat bordered class="q-pa-md">
                <!-- 像素大小检测 -->
                <div class="text-subtitle2 q-mb-md">{{ $t('pixelParams.pixelSizeParams') || '像素大小参数' }}</div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    {{ $t('pixelParams.pixelSize') }}:
                    <span>{{ params.pixelSize || 8 }}px ({{ $t('pixelParams.manualSet') }})</span>
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>{{ $t('pixelParams.pixelSizeDesc') }}</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="params.pixelSize"
                    :min="1"
                    :max="50"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 直接采样说明 -->
                <q-banner class="bg-grey-2 text-grey-8 q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="info" />
                  </template>
                  {{ $t('samplingMode.directSamplingDescription') }}
                </q-banner>

                <!-- 放大倍数参数 -->
                <div class="text-subtitle2 q-mb-md">{{ $t('samplingMode.upscaleParams') || '放大倍数' }}</div>

                <q-toggle
                  v-model="params.nativeRes"
                  class="q-mb-md"
                >
                  <template v-slot:default>
                    <span class="flex items-center">
                      {{ $t('samplingMode.nativeResolution') }}
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                        <q-tooltip>{{ $t('samplingMode.nativeResolutionDesc') }}</q-tooltip>
                      </q-icon>
                    </span>
                  </template>
                </q-toggle>

                <template v-if="!params.nativeRes">
                  <div class="q-mb-md">
                    <div class="text-body2 q-mb-sm">
                      {{ $t('samplingMode.upscaleFactor') }}: {{ params.upscale === 0 ? $t('samplingMode.auto') : params.upscale }}
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                        <q-tooltip>{{ $t('samplingMode.upscaleFactorDesc') }}</q-tooltip>
                      </q-icon>
                    </div>
                    <q-slider
                      v-model="params.upscale"
                      :min="0"
                      :max="10"
                      label
                      class="q-mb-md"
                    />
                  </div>
                </template>
              </q-card>
            </q-expansion-item>

            <!-- 状态信息 -->
            <div v-if="result" class="text-body2 text-grey-7">
              <div class="q-mb-sm">{{ $t('status.detectedPixelSize') }}: {{ result.detectedPixelSize }}px</div>
              <div class="q-mb-sm">{{ $t('status.detectedGridLines') }}: {{ result.xLines.length }} × {{ result.yLines.length }}</div>
              <div v-if="result.pixelArt">
                <div>{{ $t('status.outputSize') }}: {{ result.pixelArt.width }} × {{ result.pixelArt.height }}</div>
                <div>{{ $t('status.upscaleFactor') }}: {{ result.pixelArt.upscaleFactor }}x</div>
              </div>
              <!-- 渲染用时 -->
              <div v-if="renderTimings.total > 0" class="q-mt-md">
                <div class="text-subtitle2 q-mb-xs">{{ $t('status.renderTime') }}</div>
                <div class="q-mb-xs">总耗时: {{ renderTimings.total.toFixed(2) }}ms</div>
                <div v-if="renderTimings.energy" class="q-mb-xs">能量图: {{ renderTimings.energy.toFixed(2) }}ms</div>
                <div v-if="renderTimings.debug" class="q-mb-xs">调试图: {{ renderTimings.debug.toFixed(2) }}ms</div>
                <div v-if="renderTimings.pixelArt" class="q-mb-xs">像素画: {{ renderTimings.pixelArt.toFixed(2) }}ms</div>
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
                <div class="text-h6 q-mb-md">{{ $t('title.originalImage') }}</div>
                <div v-if="imageLoaded" class="text-center">
                  <canvas ref="originalCanvas" class="image-canvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(originalCanvas, $t('title.originalImage'))" />
                </div>
                <div v-else class="text-center text-grey-6 q-pa-lg">
                  {{ $t('fileUpload.selectImageHint') }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 纯能量图（调试模式） - 只在能量算法模式下显示 -->
          <div v-if="showDebug && result && processingMode === 'energy'" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">{{ $t('title.pureEnergyMap') }}</div>
                <div class="text-center">
                  <canvas ref="energyCanvas" class="image-canvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(energyCanvas, $t('title.pureEnergyMap'))" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 能量图和网格线（调试模式） - 只在能量算法模式下显示 -->
          <div v-if="showDebug && result && processingMode === 'energy'" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">{{ $t('title.energyMapWithGrid') }}</div>
                <div class="text-center">
                  <canvas ref="debugCanvas" class="image-canvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(debugCanvas, $t('title.energyMapWithGrid'))" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 像素化结果 -->
          <div v-if="result && result.pixelArt" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">{{ $t('title.pixelatedResult') }}</div>
                <div class="text-center">
                  <q-img
                    v-if="pixelArtDataUrl"
                    :src="pixelArtDataUrl"
                    no-native-menu
                    fit="contain"
                    class="pixel-art-result"
                    @click="openImagePreview(null, $t('title.pixelatedResult'))"
                  />
                  <canvas ref="pixelCanvas" class="pixel-canvas" v-show="false" />
                  <!-- 下载按钮组 -->
                  <div class="download-buttons">
                    <q-btn
                      color="secondary"
                      :label="$t('actions.downloadPureEnergyMap')"
                      @click="downloadEnergy"
                      icon="download"
                      class="download-btn"
                      v-if="showDebug && processingMode === 'energy'"
                    />
                    <q-btn
                      color="secondary"
                      :label="$t('actions.downloadEnergyMapWithGrid')"
                      @click="downloadDebug"
                      icon="download"
                      class="download-btn"
                      v-if="showDebug && processingMode === 'energy'"
                    />
                    <q-btn
                      color="secondary"
                      :label="$t('actions.downloadPixelArt')"
                      @click="downloadPixelArt"
                      icon="download"
                      class="download-btn"
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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { saveAs } from 'file-saver';
import UPNG from 'upng-js';
import { createPixelWorker } from 'src/pixel/workerApi';
import { runPipeline } from 'src/pixel/pipeline';
import type { PipelineParams, PipelineResult } from 'src/pixel/types';
import InlineImageViewer from 'src/components/InlineImageViewer.vue';
import WasmSettings from 'src/components/WasmSettings.vue';
import { storageService } from 'src/utils/storage';
import { useSettingsStore } from 'src/stores/settings';

const $q = useQuasar();
const { t } = useI18n();
const settingsStore = useSettingsStore();

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
const pixelArtDataUrl = ref<string>('');
let workerInstance: ReturnType<typeof createPixelWorker> | null = null;

// 图片预览器状态
const imagePreviewDialog = ref(false);
const previewImageSrc = ref('');
const previewImageName = ref('');

// 原始图片的高清数据 URL（用于预览）
const originalImageDataUrl = ref('');

// 能量图和调试图的数据 URL（用于预览）
const energyImageDataUrl = ref('');
const debugImageDataUrl = ref('');

// 渲染用时
const renderTimings = ref<{
  total: number;
  energy?: number;
  debug?: number;
  pixelArt?: number;
}>({ total: 0 });

// 直接采样模式开关
const useDirectSampling = ref(false);

// 预处理插值倍数
const preprocessInterpFactor = ref(1);

// 纯比例放大模式
const pureUpscaleMode = ref(false);
const pureUpscaleFactor = ref(4);

// 处理模式选择器
type ProcessingMode = 'energy' | 'directSampling' | 'pureUpscale';

const processingMode = ref<ProcessingMode>('energy');

const processingModeOptions = computed(() => [
  {
    value: 'energy',
    label: t('samplingMode.energyMode') || '能量算法模式',
    description: t('samplingMode.energyModeDesc') || '使用能量算法进行像素化处理，支持多种采样方式'
  },
  {
    value: 'directSampling',
    label: t('samplingMode.directSamplingMode') || '直接按比例采样',
    description: t('samplingMode.directSamplingModeDesc') || '直接按比例网格采样，生成像素画'
  },
  {
    value: 'pureUpscale',
    label: t('samplingMode.pureUpscaleMode') || '纯比例放大',
    description: t('samplingMode.pureUpscaleModeDesc') || '纯比例放大图片，不做像素化处理'
  }
]);

// 监听处理模式变化，同步更新相关变量
watch(processingMode, (newMode) => {
  if (newMode === 'energy') {
    pureUpscaleMode.value = false;
    useDirectSampling.value = false;
    params.sample = true;
  } else if (newMode === 'directSampling') {
    pureUpscaleMode.value = false;
    useDirectSampling.value = true;
    if (params.pixelSize === 0) {
      params.pixelSize = 8;
    }
  } else if (newMode === 'pureUpscale') {
    pureUpscaleMode.value = true;
    useDirectSampling.value = false;
  }
});

// 能量算法参数
const params = reactive<PipelineParams>({
  wasmEnabled: false,
  sigma: 1.0,
  enhanceEnergy: false,
  enhanceDirectional: false,
  enhanceHorizontal: 1.0,
  enhanceVertical: 1.0,
  gapTolerance: 2,
  interpThreshold: 1.5,
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

// 采样模式选项（响应式，随语言变化更新）
const sampleModeOptions = computed(() => [
  { label: t('samplingMode.centerSampling'), value: 'center' },
  { label: t('samplingMode.averageSampling'), value: 'average' },
  { label: t('samplingMode.weightedAverage'), value: 'weighted' },
  { label: t('samplingMode.directProportionalSampling'), value: 'direct' },
]);

// Watch for all parameter changes and save to localStorage
watch(
  [
    () => params.sigma,
    () => params.gapTolerance,
    () => params.interpThreshold,
    () => params.minEnergy,
    () => params.smooth,
    () => params.enhanceEnergy,
    () => params.enhanceDirectional,
    () => params.enhanceHorizontal,
    () => params.enhanceVertical,
    () => params.pixelSize,
    () => params.minS,
    () => params.maxS,
    () => params.sample,
    () => params.sampleMode,
    () => params.sampleWeightRatio,
    () => params.upscale,
    () => params.nativeRes,
    showDebug,
    useDirectSampling,
    preprocessInterpFactor,
    pureUpscaleMode,
    pureUpscaleFactor,
    processingMode,
  ],
  () => {
    // Debounced save to avoid excessive writes
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      const pixelSettings = {
        gaussianBlur: params.sigma,
        gapTolerance: params.gapTolerance,
        interpThreshold: params.interpThreshold,
        minEnergyThreshold: params.minEnergy,
        smoothWindowSize: params.smooth,
        enableEnergyEnhancement: params.enhanceEnergy,
        directionalEnhancement: params.enhanceDirectional,
        horizontalEnhancement: params.enhanceHorizontal,
        verticalEnhancement: params.enhanceVertical,
        pixelSizeMode: params.pixelSize === 0 ? 'auto' : 'manual',
        pixelSize: params.pixelSize,
        minPixelSize: params.minS,
        maxPixelSize: params.maxS,
        sampleMode: params.sampleMode,
        upScaleFactor: params.upscale,
        showOriginalImage: true,
        showEnergyMap: showDebug.value,
        showGridLines: showDebug.value,
        showPixelatedResult: true,
        weightedRatio: params.sampleWeightRatio,
        nativeResolution: params.nativeRes,
        preprocessInterpFactor: preprocessInterpFactor.value,
        pureUpscaleMode: pureUpscaleMode.value,
        pureUpscaleFactor: pureUpscaleFactor.value,
        processingMode: processingMode.value,
      } as const;
      storageService.savePixelSettings(pixelSettings);
      console.log('Settings saved:', pixelSettings);
    }, 500);
  },
  { deep: true }
);

// Debounce timeout for saving
let saveTimeout: NodeJS.Timeout | null = null;

// Load saved settings on component mount
onMounted(() => {
  console.log('Component mounted, creating worker');
  workerInstance = createPixelWorker();
  console.log('Worker created', !!workerInstance);

  // Load saved pixel settings
  const savedPixelSettings = storageService.loadPixelSettings();
  if (savedPixelSettings) {
    // Apply saved settings to reactive params
    Object.assign(params, {
      sigma: savedPixelSettings.gaussianBlur || 1.0,
      gapTolerance: savedPixelSettings.gapTolerance || 2,
      interpThreshold: savedPixelSettings.interpThreshold || 1.5,
      minEnergy: savedPixelSettings.minEnergyThreshold || 0.15,
      smooth: savedPixelSettings.smoothWindowSize || 3,
      enhanceEnergy: savedPixelSettings.enableEnergyEnhancement || false,
      enhanceDirectional: savedPixelSettings.directionalEnhancement || false,
      enhanceHorizontal: savedPixelSettings.horizontalEnhancement || 1.0,
      enhanceVertical: savedPixelSettings.verticalEnhancement || 1.0,
      pixelSize: savedPixelSettings.pixelSize || 0,
      minS: savedPixelSettings.minPixelSize || 4,
      maxS: savedPixelSettings.maxPixelSize || 40,
      sample: savedPixelSettings.sampleMode ? true : true,
      sampleMode: savedPixelSettings.sampleMode || 'center',
      sampleWeightRatio: savedPixelSettings.weightedRatio || 0.6,
      upscale: savedPixelSettings.upScaleFactor || 0,
      nativeRes: savedPixelSettings.nativeResolution || false,
    });

    // Apply display settings
    showDebug.value = savedPixelSettings.showEnergyMap !== false;
    useDirectSampling.value = savedPixelSettings.sampleMode === 'direct';

    // Apply UI settings
    preprocessInterpFactor.value = savedPixelSettings.preprocessInterpFactor || 1;
    pureUpscaleMode.value = savedPixelSettings.pureUpscaleMode || false;
    pureUpscaleFactor.value = savedPixelSettings.pureUpscaleFactor || 4;

    // 优先使用保存的处理模式，如果没有则根据旧方式推断
    if (savedPixelSettings.processingMode) {
      processingMode.value = savedPixelSettings.processingMode;
    } else {
      // 兼容旧版本：根据保存的设置确定处理模式
      if (pureUpscaleMode.value) {
        processingMode.value = 'pureUpscale';
      } else if (useDirectSampling.value) {
        processingMode.value = 'directSampling';
      } else {
        processingMode.value = 'energy';
      }
    }

    console.log('Loaded saved settings:', savedPixelSettings);
  }
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
    originalImageDataUrl.value = '';
    return;
  }

  // 保存原始图片的高清 data URL 用于预览
  originalImageDataUrl.value = URL.createObjectURL(file);

  // 清空旧的能量图和调试图 data URL
  energyImageDataUrl.value = '';
  debugImageDataUrl.value = '';

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

  // 重置渲染用时
  renderTimings.value = { total: 0 };
  const totalStartTime = performance.now();

  try {
    // 纯比例放大模式 - 直接放大，不做任何处理
    if (pureUpscaleMode.value) {
      console.log('[Pure Upscale Mode] Running pure upscale with factor:', pureUpscaleFactor.value);
      await runPureUpscale();
      const totalElapsed = performance.now() - totalStartTime;
      renderTimings.value.total = totalElapsed;
      renderTimings.value.pixelArt = totalElapsed;
      console.log(`纯比例放大完成，用时: ${totalElapsed.toFixed(2)}ms`);
      $q.notify({
        type: 'positive',
        message: t('status.processingComplete'),
      });
      return;
    }

    // 获取图片数据
    const ctx = originalCanvas.value.getContext('2d')!;
    let imageData = ctx.getImageData(0, 0, originalCanvas.value.width, originalCanvas.value.height);

    // 预处理插值放大（仅在倍数>1时执行）
    if (preprocessInterpFactor.value > 1) {
      const factor = preprocessInterpFactor.value;
      const srcWidth = originalCanvas.value.width;
      const srcHeight = originalCanvas.value.height;
      const dstWidth = Math.floor(srcWidth * factor);
      const dstHeight = Math.floor(srcHeight * factor);

      console.log(`[预处理插值] ${srcWidth}x${srcHeight} -> ${dstWidth}x${dstHeight} (${factor}x)`);

      // 创建放大后的图像数据（使用最近邻插值）
      const dstImageData = new ImageData(dstWidth, dstHeight);
      const srcData = imageData.data;
      const dstData = dstImageData.data;

      for (let dy = 0; dy < dstHeight; dy++) {
        for (let dx = 0; dx < dstWidth; dx++) {
          // 最近邻插值
          const sx = Math.floor(dx / factor);
          const sy = Math.floor(dy / factor);
          const srcIdx = (sy * srcWidth + sx) * 4;
          const dstIdx = (dy * dstWidth + dx) * 4;

          dstData[dstIdx] = srcData[srcIdx]!;         // R
          dstData[dstIdx + 1] = srcData[srcIdx + 1]!; // G
          dstData[dstIdx + 2] = srcData[srcIdx + 2]!; // B
          dstData[dstIdx + 3] = srcData[srcIdx + 3]!; // A
        }
      }

      imageData = dstImageData;
    }

    // 准备输入数据
    const input = {
      width: imageData.width,
      height: imageData.height,
      rgba: imageData.data.buffer,
    };

    // 将 reactive params 转换为普通对象
    const plainParams = {
      ...JSON.parse(JSON.stringify(params)),
      wasmEnabled: settingsStore.wasmEnabled,
      // 根据处理模式动态设置采样方式，不修改原始 params
      sampleMode: processingMode.value === 'directSampling' ? 'direct' : params.sampleMode
    };

    console.log('Input data:', {
      width: input.width,
      height: input.height,
      rgba: input.rgba.byteLength,
      params: plainParams
    });

    let resultData: PipelineResult;

    // 根据 WASM 设置选择执行方式
    if (settingsStore.wasmEnabled) {
      // WASM 启用：在主线程直接运行（WASM 只在主线程工作）
      console.log('[Main Thread] Running pipeline with WASM...');
      resultData = await runPipeline(input, plainParams, 'main');
    } else {
      // WASM 禁用：使用 Worker 运行（避免阻塞主线程）
      console.log('[Worker] Running pipeline with JavaScript...');
      resultData = await workerInstance!.api.runPipeline(input, plainParams);
    }

    console.log('Pipeline result:', resultData);
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

    const totalElapsed = performance.now() - totalStartTime;
    renderTimings.value.total = totalElapsed;
    console.log(`总渲染用时: ${totalElapsed.toFixed(2)}ms`);

    $q.notify({
      type: 'positive',
      message: t('status.processingComplete'),
    });
  } catch (error) {
    console.error('处理错误:', error);
    $q.notify({
      type: 'negative',
      message: t('status.processingFailed') + String(error),
    });
  } finally {
    processing.value = false;
  }
}

// 纯比例放大函数
async function runPureUpscale() {
  if (!originalCanvas.value || !pixelCanvas.value) {
    await nextTick();
  }

  if (!originalCanvas.value) {
    throw new Error('Original canvas not available');
  }

  const srcWidth = originalCanvas.value.width;
  const srcHeight = originalCanvas.value.height;
  const factor = pureUpscaleFactor.value;

  const dstWidth = srcWidth * factor;
  const dstHeight = srcHeight * factor;

  console.log(`纯比例放大: ${srcWidth}x${srcHeight} -> ${dstWidth}x${dstHeight} (${factor}x)`);

  // 获取原始图像数据
  const srcCtx = originalCanvas.value.getContext('2d')!;
  const srcImageData = srcCtx.getImageData(0, 0, srcWidth, srcHeight);

  // 创建放大后的图像数据
  const dstImageData = new ImageData(dstWidth, dstHeight);
  const srcData = srcImageData.data;
  const dstData = dstImageData.data;

  // 最近邻插值放大
  for (let dy = 0; dy < dstHeight; dy++) {
    for (let dx = 0; dx < dstWidth; dx++) {
      // 计算源像素位置（向下取整实现最近邻）
      const sx = Math.floor(dx / factor);
      const sy = Math.floor(dy / factor);

      // 计算索引
      const srcIdx = (sy * srcWidth + sx) * 4;
      const dstIdx = (dy * dstWidth + dx) * 4;

      // 复制像素
      dstData[dstIdx] = srcData[srcIdx]!;         // R
      dstData[dstIdx + 1] = srcData[srcIdx + 1]!; // G
      dstData[dstIdx + 2] = srcData[srcIdx + 2]!; // B
      dstData[dstIdx + 3] = srcData[srcIdx + 3]!; // A
    }
  }

  // 设置像素画结果
  // 创建 RGB buffer（用于类型系统，保留 alpha 通道在 rgba 中）
  const rgbData = new Uint8Array(dstWidth * dstHeight * 3);
  for (let i = 0; i < dstWidth * dstHeight; i++) {
    rgbData[i * 3] = dstData[i * 4]!;     // R
    rgbData[i * 3 + 1] = dstData[i * 4 + 1]!; // G
    rgbData[i * 3 + 2] = dstData[i * 4 + 2]!; // B
  }

  result.value = {
    width: dstWidth,
    height: dstHeight,
    detectedPixelSize: 1,
    energyU8: new Uint8Array(dstWidth * dstHeight).buffer,
    xLines: [],
    yLines: [],
    allXLines: [],
    allYLines: [],
    pixelArt: {
      width: dstWidth,
      height: dstHeight,
      rgb: rgbData.buffer,
      rgba: dstData.buffer,
      upscaleFactor: factor
    }
  };

  // 渲染像素画
  await nextTick();
  if (pixelCanvas.value) {
    pixelCanvas.value.width = dstWidth;
    pixelCanvas.value.height = dstHeight;
    const ctx = pixelCanvas.value.getContext('2d')!;
    ctx.putImageData(dstImageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  renderPixelArt();
}

// 渲染纯能量图（没有网格线和绿点）
function renderEnergyImage() {
  if (!result.value || !energyCanvas.value) return;

  const startTime = performance.now();
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

  // 保存高清 data URL 用于预览
  energyImageDataUrl.value = energyCanvas.value.toDataURL('image/png', 1.0);

  const elapsed = performance.now() - startTime;
  renderTimings.value.energy = elapsed;
  console.log(`纯能量图渲染用时: ${elapsed.toFixed(2)}ms`);
}

// 渲染调试图像（能量图+网格线）
function renderDebugImage() {
  if (!result.value || !debugCanvas.value) return;

  const startTime = performance.now();
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
    // 使用与实际采样位置一致的计算方式（向下取整）
    const x = ((allXLines[i]! + allXLines[i + 1]!) / 2) | 0;
    for (let j = 0; j < allYLines.length - 1; j++) {
      // 使用与实际采样位置一致的计算方式（向下取整）
      const y = ((allYLines[j]! + allYLines[j + 1]!) / 2) | 0;
      ctx.fillRect(x - 1, y - 1, 2, 2);
      centerPointCount++;
    }
  }
  console.log('Debug image rendering completed', { centerPointCount });

  // 保存高清 data URL 用于预览
  debugImageDataUrl.value = debugCanvas.value.toDataURL('image/png', 1.0);

  const elapsed = performance.now() - startTime;
  renderTimings.value.debug = elapsed;
  console.log(`调试图渲染用时: ${elapsed.toFixed(2)}ms`);
}

// 渲染像素画
function renderPixelArt() {
  if (!result.value?.pixelArt) return;

  const startTime = performance.now();
  const { width, height, rgb, rgba } = result.value.pixelArt;

  // 如果有 RGBA 数据，直接生成 data URL
  if (rgba) {
    const rgbaData = new Uint8Array(rgba);

    // 调试：检查透明度数据
    let transparentPixels = 0;
    let totalPixels = 0;
    for (let i = 0; i < rgbaData.length; i += 4) {
      totalPixels++;
      const alpha = rgbaData[i + 3];
      if (alpha !== undefined && alpha < 128) transparentPixels++;
    }
    console.log(`像素画渲染调试: 总像素=${totalPixels}, 透明像素=${transparentPixels}, 透明比例=${(transparentPixels/totalPixels*100).toFixed(1)}%`);

    // 直接从 RGBA 数据生成 PNG data URL
    pixelArtDataUrl.value = createPngDataUrl(width, height, rgbaData);
  } else if (rgb) {
    // 如果只有 RGB 数据，转换为 RGBA
    const rgbData = new Uint8Array(rgb);
    const rgbaData = new Uint8Array(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const rgbIdx = i * 3;
      const rgbaIdx = i * 4;
      rgbaData[rgbaIdx] = rgbData[rgbIdx] || 0;         // R
      rgbaData[rgbaIdx + 1] = rgbData[rgbIdx + 1] || 0; // G
      rgbaData[rgbaIdx + 2] = rgbData[rgbIdx + 2] || 0; // B
      rgbaData[rgbaIdx + 3] = 255;                      // A
    }

    pixelArtDataUrl.value = createPngDataUrl(width, height, rgbaData);
  }

  // 同时渲染到隐藏的 canvas 用于回退
  if (pixelCanvas.value) {
    pixelCanvas.value.width = width;
    pixelCanvas.value.height = height;
    const ctx = pixelCanvas.value.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);

    if (rgba) {
      const rgbaData = new Uint8Array(rgba);
      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        imageData.data[idx] = rgbaData[idx] || 0;
        imageData.data[idx + 1] = rgbaData[idx + 1] || 0;
        imageData.data[idx + 2] = rgbaData[idx + 2] || 0;
        imageData.data[idx + 3] = rgbaData[idx + 3] || 255;
      }
    } else if (rgb) {
      const rgbData = new Uint8Array(rgb);
      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        const rgbIdx = i * 3;
        imageData.data[idx] = rgbData[rgbIdx] || 0;
        imageData.data[idx + 1] = rgbData[rgbIdx + 1] || 0;
        imageData.data[idx + 2] = rgbData[rgbIdx + 2] || 0;
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  const elapsed = performance.now() - startTime;
  renderTimings.value.pixelArt = elapsed;
  console.log(`像素画渲染用时: ${elapsed.toFixed(2)}ms`);
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
    const arrayBuffer = rgbaData.buffer.slice(rgbaData.byteOffset, rgbaData.byteOffset + rgbaData.byteLength);
    const pngData = UPNG.encode([arrayBuffer], width, height, 0);

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
  const arrayBuffer = correctedData.buffer.slice(correctedData.byteOffset, correctedData.byteOffset + correctedData.byteLength);
  const pngData = UPNG.encode([arrayBuffer], width, height, 0);
  const blob = new Blob([pngData as BlobPart], { type: 'image/png' });
  return URL.createObjectURL(blob);
}

// 打开图片预览器
function openImagePreview(canvas: HTMLCanvasElement | null, imageName: string) {
  // 根据图片类型选择对应的 data URL
  if (imageName === t('title.pixelatedResult') && pixelArtDataUrl.value) {
    // 像素画预览，使用已生成的 data URL
    previewImageSrc.value = pixelArtDataUrl.value;
  } else if (imageName === t('title.originalImage') && originalImageDataUrl.value) {
    // 原始图片预览，使用保存的高清 data URL（来自原始文件）
    previewImageSrc.value = originalImageDataUrl.value;
  } else if (imageName === t('title.pureEnergyMap') && energyImageDataUrl.value) {
    // 纯能量图预览，使用保存的高清 data URL
    previewImageSrc.value = energyImageDataUrl.value;
  } else if (imageName === t('title.energyMapWithGrid') && debugImageDataUrl.value) {
    // 能量图+网格线预览，使用保存的高清 data URL
    previewImageSrc.value = debugImageDataUrl.value;
  } else if (canvas) {
    // 回退：使用 canvas.toDataURL() 并指定最高质量
    previewImageSrc.value = canvas.toDataURL('image/png', 1.0);
  } else {
    // 没有可用的图片源
    return;
  }

  previewImageName.value = imageName;
  imagePreviewDialog.value = true;
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

/* 像素画样式 */
.pixel-canvas {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* 像素画结果样式 */
.pixel-art-result {
  max-width: 100% !important;
  height: auto !important;
  cursor: pointer !important;
  background: repeating-conic-gradient(#f0f0f0 0 25%, transparent 0 50%) 0 0 / 20px 20px !important;
  image-rendering: pixelated !important;
  image-rendering: -moz-crisp-edges !important;
  image-rendering: crisp-edges !important;
}

/* 更深的选择器来覆盖Quasar的样式 */
.q-img.pixel-art-result img,
.q-img.pixel-art-result .q-img__image {
  image-rendering: pixelated !important;
  image-rendering: -moz-crisp-edges !important;
  image-rendering: crisp-edges !important;
}

/* 图片画布样式 - 用于原始图片、能量图等 */
.image-canvas {
  /* 使用像素化渲染保持清晰度 */
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  max-width: 100%;
  height: auto;
}

/* 下载按钮组样式 */
.download-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.download-btn {
  min-width: 120px;
  flex: 1 1 auto;
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

  .download-buttons {
    flex-direction: column;
  }

  .download-btn {
    width: 100%;
  }
}

/* Dark mode adjustments */
.body--dark .text-grey-7 {
  color: var(--text-secondary) !important;
}

.body--dark .text-grey-6 {
  color: var(--text-tertiary) !important;
}

.body--dark .bg-grey-2 {
  background: var(--bg-secondary) !important;
}

.body--dark .text-grey-8 {
  color: var(--text-primary) !important;
}

.body--dark .q-card {
  background: var(--card-bg);
  border-color: var(--border-color);
}

.body--dark .pixel-art-result {
  background: repeating-conic-gradient(var(--checkered-bg-light) 0 25%, transparent 0 50%) 0 0 / 20px 20px !important;
}

.body--dark .q-banner.bg-grey-2 {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

/* q-select 下拉菜单深色模式适配 */
.body--dark :deep(.q-menu) {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.body--dark :deep(.q-menu .q-item) {
  color: var(--text-primary);
}

.body--dark :deep(.q-menu .q-item:hover) {
  background: var(--bg-tertiary);
}

.body--dark :deep(.q-select__dropdown-option) {
  color: var(--text-primary);
}

/* q-file 组件深色模式适配 */
.body--dark :deep(.q-field__control) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.body--dark :deep(.q-field__label) {
  color: var(--text-secondary);
}

.body--dark :deep(.q-field--outlined .q-field__control:before) {
  border-color: var(--border-color);
}

/* q-slider 深色模式适配 */
.body--dark :deep(.q-slider__track) {
  background: var(--bg-tertiary);
}

/* q-file 组件深色模式适配 */
.body--dark :deep(.q-file) {
  background: var(--bg-secondary);
}

.body--dark :deep(.q-file .q-field__control) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.body--dark :deep(.q-file .q-field__native) {
  color: var(--text-primary);
}

.body--dark :deep(.q-file .q-field__label) {
  color: var(--text-secondary);
}

.body--dark :deep(.q-file .q-field__prepend) {
  color: var(--text-primary);
}

.body--dark :deep(.q-file__fill) {
  background: var(--bg-tertiary);
}

/* q-select 下拉菜单深色模式适配 */
.body--dark :deep(.q-select) {
  background: var(--bg-secondary);
}

.body--dark :deep(.q-select .q-field__control) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.body--dark :deep(.q-select .q-field__native) {
  color: var(--text-primary);
}

.body--dark :deep(.q-select .q-field__label) {
  color: var(--text-secondary);
}

.body--dark :deep(.q-select .q-field__append) {
  color: var(--text-primary);
}

.body--dark :deep(.q-select .q-field__marginal) {
  color: var(--text-primary);
}

/* 下拉选项列表样式 */
.body--dark :deep(.q-menu) {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.body--dark :deep(.q-menu .q-item) {
  color: var(--text-primary);
  background: transparent;
}

.body--dark :deep(.q-menu .q-item:hover) {
  background: var(--bg-tertiary);
}

.body--dark :deep(.q-menu .q-item.q-item--active) {
  background: var(--bg-tertiary);
}

.body--dark :deep(.q-menu .q-item-label) {
  color: var(--text-primary);
}

/* 下拉选项被选中状态 */
.body--dark :deep(.q-virtual-list__content) {
  background: var(--card-bg);
}

.body--dark :deep(.q-select__dropdown-option) {
  color: var(--text-primary);
}

.body--dark :deep(.q-select__dropdown-option--selected) {
  background: var(--bg-tertiary);
}

.body--dark :deep(.q-select__dropdown-option:hover) {
  background: var(--bg-tertiary);
}
</style>
