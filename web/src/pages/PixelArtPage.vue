<template>
  <q-page class="q-pa-md">
    <!-- 大屏幕水平布局：控制面板和图片区域并排 -->
    <div class="horizontal-layout">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <q-card class="control-panel-card">
          <q-card-section class="q-pa-none">
            <div class="control-panel-content">
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

            <!-- 边缘检测模式参数 (仅在边缘检测模式下显示) -->
            <q-expansion-item
              v-if="processingMode === 'edgeDetect'"
              label="边缘检测参数"
              default-opened
              class="q-mb-md"
            >
              <q-card flat bordered class="q-pa-md">
                <!-- 边缘检测阈值 -->
                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    边缘检测阈值: {{ edgeDetectParams.edgeThreshold.toFixed(2) }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>越低检测到的边缘越多，越高检测到的边缘越少</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.edgeThreshold"
                    :min="0.01"
                    :max="0.5"
                    :step="0.01"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 网格大小范围 -->
                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    最小网格大小: {{ edgeDetectParams.minGridSize }}px
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>检测到的最小像素网格大小</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.minGridSize"
                    :min="1"
                    :max="10"
                    :step="1"
                    label
                    class="q-mb-md"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    最大网格大小: {{ edgeDetectParams.maxGridSize }}px
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>检测到的最大像素网格大小</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.maxGridSize"
                    :min="10"
                    :max="50"
                    :step="1"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 手动像素大小（当自动检测失败时使用） -->
                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    手动像素大小: {{ edgeDetectParams.pixelSize > 0 ? edgeDetectParams.pixelSize + 'px' : '自动检测' }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>设置为0时自动检测，否则使用固定大小</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.pixelSize"
                    :min="0"
                    :max="50"
                    :step="1"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 网格偏移（用于微调） -->
                <div class="text-subtitle2 q-mb-md">网格位置微调</div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    水平偏移 (X): {{ edgeDetectParams.offsetX.toFixed(2) }}px
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>微调网格的水平位置，支持小数步进</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.offsetX"
                    :min="-10"
                    :max="10"
                    :step="0.01"
                    label
                    class="q-mb-md"
                    @change="updateEdgeDetectPreview"
                  />
                </div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    垂直偏移 (Y): {{ edgeDetectParams.offsetY.toFixed(2) }}px
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>微调网格的垂直位置，支持小数步进</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.offsetY"
                    :min="-10"
                    :max="10"
                    :step="0.01"
                    label
                    class="q-mb-md"
                    @change="updateEdgeDetectPreview"
                  />
                </div>

                <!-- 放大倍数 -->
                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    放大倍数: {{ edgeDetectParams.upscale }}x
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>输出图像的放大倍数</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.upscale"
                    :min="1"
                    :max="20"
                    :step="1"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 采样模式选择 -->
                <div class="text-subtitle2 q-mb-md">采样设置</div>

                <div class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    采样模式
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>选择每个网格内的采样方式</q-tooltip>
                    </q-icon>
                  </div>
                  <q-select
                    v-model="edgeDetectParams.sampleMode"
                    :options="sampleModeOptions"
                    emit-value
                    map-options
                  />
                </div>

                <!-- 权重比例（仅在 weighted 模式下显示） -->
                <div v-if="edgeDetectParams.sampleMode === 'weighted'" class="q-mb-md">
                  <div class="text-body2 q-mb-sm">
                    权重比例: {{ edgeDetectParams.sampleWeightRatio.toFixed(1) }}
                    <q-icon name="help" size="xs" color="primary" class="cursor-pointer">
                      <q-tooltip>采样区域的权重比例</q-tooltip>
                    </q-icon>
                  </div>
                  <q-slider
                    v-model="edgeDetectParams.sampleWeightRatio"
                    :min="0.1"
                    :max="0.9"
                    :step="0.1"
                    label
                    class="q-mb-md"
                  />
                </div>

                <!-- 原生分辨率 -->
                <q-toggle
                  v-model="edgeDetectParams.nativeRes"
                  class="q-mb-md"
                >
                  <template v-slot:default>
                    <span class="flex items-center">
                      使用原生分辨率（1像素=1网格）
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                        <q-tooltip>每个网格输出一个像素，不进行放大</q-tooltip>
                      </q-icon>
                    </span>
                  </template>
                </q-toggle>

                <!-- 实时预览开关 -->
                <q-toggle
                  v-model="showEdgeDetectPreview"
                  class="q-mb-md"
                  @update:model-value="updateEdgeDetectPreview"
                >
                  <template v-slot:default>
                    <span class="flex items-center">
                      显示实时预览（网格覆盖）
                      <q-icon name="help" size="xs" color="primary" class="cursor-pointer q-ml-xs">
                        <q-tooltip>在原图上实时显示检测到的网格线</q-tooltip>
                      </q-icon>
                    </span>
                  </template>
                </q-toggle>
              </q-card>
            </q-expansion-item>

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

          <!-- 边缘检测实时预览（网格覆盖） - 只在边缘检测模式下显示 -->
          <div v-if="showEdgeDetectPreview && processingMode === 'edgeDetect'" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">网格预览（实时）</div>
                <div class="text-center">
                  <canvas ref="edgeDetectPreviewCanvas" class="image-canvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(edgeDetectPreviewCanvas, '网格预览')" />
                </div>
                <div v-if="edgeDetectResult" class="text-body2 text-grey-7 q-mt-md">
                  <div>像素大小: {{ edgeDetectResult.pixelSize }}px</div>
                  <div>采样网格: {{ edgeDetectResult.vLines.length - 1 }} × {{ edgeDetectResult.hLines.length - 1 }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 边缘检测像素化结果 -->
          <div v-if="edgeDetectResult && processingMode === 'edgeDetect'" class="image-card">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">像素化结果</div>
                <div class="text-center">
                  <canvas ref="pixelCanvas" class="image-canvas" style="max-width: 100%; height: auto; cursor: pointer;" @click="openImagePreview(pixelCanvas, '像素化结果')" />
                </div>
                <!-- 下载按钮组 -->
                <div class="download-buttons">
                  <q-btn
                    color="secondary"
                    label="下载像素画"
                    @click="downloadEdgeDetectPixelArt"
                    icon="download"
                    class="download-btn"
                  />
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
import { edgeDetectPixelize, sampleWithGrid } from 'src/pixel/edgeDetect';
import type { EdgeDetectParams, EdgeDetectResult } from 'src/pixel/types';
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
const edgeDetectPreviewCanvas = ref<HTMLCanvasElement | null>(null);
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
const edgeDetectPreviewDataUrl = ref('');

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

// 边缘检测模式参数
const edgeDetectParams = reactive<EdgeDetectParams>({
  edgeThreshold: 0.1,
  minGridSize: 2,
  maxGridSize: 20,
  offsetX: 0,
  offsetY: 0,
  pixelSize: 0, // 0 = auto
  upscale: 4,
  nativeRes: false,
  sampleMode: 'center',
  sampleWeightRatio: 0.6,
});

// 边缘检测结果
const edgeDetectResult = ref<EdgeDetectResult | null>(null);

// 实时预览模式（边缘检测）
const showEdgeDetectPreview = ref(false);

// 处理模式选择器
type ProcessingMode = 'energy' | 'directSampling' | 'pureUpscale' | 'edgeDetect';

const processingMode = ref<ProcessingMode>('energy');

const processingModeOptions = computed(() => [
  {
    value: 'energy',
    label: t('samplingMode.energyMode') || '能量算法模式',
    description: t('samplingMode.energyModeDesc') || '使用能量算法进行像素化处理，支持多种采样方式'
  },
  {
    value: 'edgeDetect',
    label: '边缘检测模式',
    description: '通过边缘检测自动识别像素网格，支持精细调整'
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
  } else if (newMode === 'edgeDetect') {
    pureUpscaleMode.value = false;
    useDirectSampling.value = false;
    // 边缘检测模式独立处理
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

  // 切换模式时重置边缘检测结果
  if (newMode !== 'edgeDetect') {
    edgeDetectResult.value = null;
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
    // 边缘检测参数
    () => edgeDetectParams.edgeThreshold,
    () => edgeDetectParams.pixelSize,
    () => edgeDetectParams.minGridSize,
    () => edgeDetectParams.maxGridSize,
    () => edgeDetectParams.offsetX,
    () => edgeDetectParams.offsetY,
    () => edgeDetectParams.upscale,
    () => edgeDetectParams.nativeRes,
    () => edgeDetectParams.sampleMode,
    () => edgeDetectParams.sampleWeightRatio,
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
        // 边缘检测模式参数
        edgeDetectThreshold: edgeDetectParams.edgeThreshold,
        edgeDetectMinGridSize: edgeDetectParams.minGridSize,
        edgeDetectMaxGridSize: edgeDetectParams.maxGridSize,
        edgeDetectPixelSize: edgeDetectParams.pixelSize,
        edgeDetectOffsetX: edgeDetectParams.offsetX,
        edgeDetectOffsetY: edgeDetectParams.offsetY,
        edgeDetectUpscale: edgeDetectParams.upscale,
        edgeDetectNativeRes: edgeDetectParams.nativeRes,
        edgeDetectSampleMode: edgeDetectParams.sampleMode,
        edgeDetectSampleWeightRatio: edgeDetectParams.sampleWeightRatio,
      } as const;
      storageService.savePixelSettings(pixelSettings);
      console.log('Settings saved:', pixelSettings);
    }, 500);
  },
  { deep: true }
);

// Debounce timeout for saving
let saveTimeout: NodeJS.Timeout | null = null;

// Watch edge detection parameters for real-time preview update
watch(
  [
    () => edgeDetectParams.edgeThreshold,
    () => edgeDetectParams.pixelSize,
    () => edgeDetectParams.minGridSize,
    () => edgeDetectParams.maxGridSize,
    () => edgeDetectParams.offsetX,
    () => edgeDetectParams.offsetY,
  ],
  () => {
    // 实时更新预览（当边缘检测模式且预览开启时）
    if (processingMode.value === 'edgeDetect' && showEdgeDetectPreview.value) {
      // 清除旧的结果，强制重新检测
      edgeDetectResult.value = null;
      void updateEdgeDetectPreview();
    }
  },
  { deep: true }
);

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

    // 加载边缘检测模式参数
    Object.assign(edgeDetectParams, {
      edgeThreshold: savedPixelSettings.edgeDetectThreshold ?? 0.1,
      pixelSize: savedPixelSettings.edgeDetectPixelSize ?? 0,
      minGridSize: savedPixelSettings.edgeDetectMinGridSize ?? 2,
      maxGridSize: savedPixelSettings.edgeDetectMaxGridSize ?? 20,
      offsetX: savedPixelSettings.edgeDetectOffsetX ?? 0,
      offsetY: savedPixelSettings.edgeDetectOffsetY ?? 0,
      upscale: savedPixelSettings.edgeDetectUpscale ?? 4,
      nativeRes: savedPixelSettings.edgeDetectNativeRes ?? false,
      sampleMode: savedPixelSettings.edgeDetectSampleMode ?? 'center',
      sampleWeightRatio: savedPixelSettings.edgeDetectSampleWeightRatio ?? 0.6,
    });

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
  edgeDetectPreviewDataUrl.value = '';

  // 清空边缘检测结果
  edgeDetectResult.value = null;

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
    // 边缘检测模式 - 使用边缘检测算法进行像素化
    if (processingMode.value === 'edgeDetect') {
      console.log('[Edge Detect Mode] Running edge detection pixelization');
      await processEdgeDetectImage();
      const totalElapsed = performance.now() - totalStartTime;
      renderTimings.value.total = totalElapsed;
      renderTimings.value.pixelArt = totalElapsed;
      console.log(`边缘检测处理完成，用时: ${totalElapsed.toFixed(2)}ms`);
      return;
    }

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
  } else if (imageName === '像素化结果' && pixelCanvas.value) {
    // 边缘检测像素化结果预览
    previewImageSrc.value = pixelCanvas.value.toDataURL('image/png', 1.0);
  } else if (imageName === '网格预览' && edgeDetectPreviewDataUrl.value) {
    // 边缘检测网格预览
    previewImageSrc.value = edgeDetectPreviewDataUrl.value;
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

// ==================== 边缘检测模式相关函数 ====================

/**
 * 更新边缘检测实时预览
 */
function updateEdgeDetectPreview() {
  if (!originalCanvas.value || processingMode.value !== 'edgeDetect' || !showEdgeDetectPreview.value) {
    return;
  }

  // 在下一个 tick 中执行，确保 DOM 已更新
  void nextTick(() => {
    renderEdgeDetectPreview();
  });
}

/**
 * 渲染边缘检测实时预览（网格覆盖在原图上）
 */
function renderEdgeDetectPreview() {
  if (!originalCanvas.value || !edgeDetectPreviewCanvas.value) return;

  const ctx = originalCanvas.value.getContext('2d')!;
  const previewCtx = edgeDetectPreviewCanvas.value.getContext('2d')!;

  const width = originalCanvas.value.width;
  const height = originalCanvas.value.height;

  // 设置预览画布大小
  edgeDetectPreviewCanvas.value.width = width;
  edgeDetectPreviewCanvas.value.height = height;

  // 复制原图到预览画布
  const imageData = ctx.getImageData(0, 0, width, height);
  previewCtx.putImageData(imageData, 0, 0);

  // 如果没有边缘检测结果，先执行检测
  if (!edgeDetectResult.value) {
    const rgba = imageData.data;
    const result = edgeDetectPixelize(rgba, width, height, edgeDetectParams);
    edgeDetectResult.value = result;
  }

  const edgeResult = edgeDetectResult.value;
  if (!edgeResult) return;

  const { hLines, vLines, pixelSize } = edgeResult;

  // 绘制垂直网格线（红色）
  previewCtx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
  previewCtx.lineWidth = 1;
  for (const x of vLines) {
    previewCtx.beginPath();
    previewCtx.moveTo(x, 0);
    previewCtx.lineTo(x, height);
    previewCtx.stroke();
  }

  // 绘制水平网格线（蓝色）
  previewCtx.strokeStyle = 'rgba(0, 100, 255, 0.7)';
  previewCtx.lineWidth = 1;
  for (const y of hLines) {
    previewCtx.beginPath();
    previewCtx.moveTo(0, y);
    previewCtx.lineTo(width, y);
    previewCtx.stroke();
  }

  // 在左上角显示像素大小信息
  previewCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  previewCtx.fillRect(10, 10, 150, 40);
  previewCtx.fillStyle = 'white';
  previewCtx.font = '14px monospace';
  previewCtx.fillText(`像素大小: ${pixelSize}px`, 20, 35);

  // 保存预览 data URL
  edgeDetectPreviewDataUrl.value = edgeDetectPreviewCanvas.value.toDataURL('image/png', 1.0);
}

/**
 * 处理边缘检测模式的图像
 */
async function processEdgeDetectImage() {
  if (!originalCanvas.value) return;

  processing.value = true;

  try {
    const ctx = originalCanvas.value.getContext('2d')!;
    const width = originalCanvas.value.width;
    const height = originalCanvas.value.height;

    const imageData = ctx.getImageData(0, 0, width, height);
    const rgba = imageData.data;

    // 执行边缘检测像素化
    const result = edgeDetectPixelize(rgba, width, height, edgeDetectParams);
    edgeDetectResult.value = result;

    // 渲染像素化结果
    await nextTick();
    renderEdgeDetectPixelArt();

    // 如果启用了预览，也渲染预览
    if (showEdgeDetectPreview.value) {
      renderEdgeDetectPreview();
    }

    $q.notify({
      type: 'positive',
      message: '边缘检测处理完成',
    });
  } catch (error) {
    console.error('边缘检测处理错误:', error);
    $q.notify({
      type: 'negative',
      message: '处理失败: ' + String(error),
    });
  } finally {
    processing.value = false;
  }
}

/**
 * 渲染边缘检测像素化结果
 */
function renderEdgeDetectPixelArt() {
  if (!edgeDetectResult.value || !pixelCanvas.value || !originalCanvas.value) return;

  const { hLines, vLines } = edgeDetectResult.value;
  const ctx = originalCanvas.value.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, originalCanvas.value.width, originalCanvas.value.height);
  const rgba = imageData.data;

  // 使用网格进行采样
  const { pixelated, pixelatedWidth, pixelatedHeight } = sampleWithGrid(
    rgba,
    originalCanvas.value.width,
    originalCanvas.value.height,
    hLines,
    vLines,
    edgeDetectParams.sampleMode,
    edgeDetectParams.sampleWeightRatio,
    edgeDetectParams.upscale,
    edgeDetectParams.nativeRes
  );

  pixelCanvas.value.width = pixelatedWidth;
  pixelCanvas.value.height = pixelatedHeight;

  const pixelCtx = pixelCanvas.value.getContext('2d')!;
  const outputImageData = pixelCtx.createImageData(pixelatedWidth, pixelatedHeight);

  for (let i = 0; i < pixelated.length; i++) {
    outputImageData.data[i] = pixelated[i] || 0;
  }

  pixelCtx.putImageData(outputImageData, 0, 0);
  pixelCtx.imageSmoothingEnabled = false;
}

/**
 * 下载边缘检测像素画
 */
function downloadEdgeDetectPixelArt() {
  if (!pixelCanvas.value) return;

  const width = pixelCanvas.value.width;
  const height = pixelCanvas.value.height;

  // 从 canvas 获取数据
  const ctx = pixelCanvas.value.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, width, height);
  const rgbaData = imageData.data;

  // 使用 upng-js 编码
  const arrayBuffer = rgbaData.buffer.slice(rgbaData.byteOffset, rgbaData.byteOffset + rgbaData.byteLength);
  const pngData = UPNG.encode([arrayBuffer], width, height, 0);
  const blob = new Blob([pngData as BlobPart], { type: 'image/png' });

  const pixelSize = edgeDetectResult.value?.pixelSize ?? edgeDetectParams.pixelSize;
  saveAs(blob, `edge_detect_pixelart_size${pixelSize}_${Date.now()}.png`);
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
  /* 设置最大高度：100vh - header(50px) - page padding上下(32px) - 一些额外边距 */
  max-height: calc(100vh - 50px - 32px - 8px);
  /* 让控制面板卡片占满高度 */
  display: flex;
  flex-direction: column;
}

.control-panel-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.control-panel .q-pa-none {
  flex: 1;
  padding: 0 !important;
  overflow: hidden;
}

.control-panel-content {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* 深色模式滚动条颜色 */
.body--dark .control-panel-content {
  scrollbar-color: #666 #2a2a2a;
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
    max-height: none; /* 禁用最大高度 */
  }

  .control-panel-card {
    height: auto; /* 卡片高度自适应 */
    display: block; /* 取消 flex 布局 */
  }

  .control-panel .q-pa-none {
    flex: none;
    overflow: visible; /* 允许内容溢出 */
  }

  .control-panel-content {
    height: auto; /* 内容高度自适应 */
    overflow-y: visible; /* 禁用内部滚动 */
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

<!-- 非 scoped 样式：用于 Webkit 滚动条样式 -->
<style>
/* 控制面板滚动条样式 - 针对 .control-panel-content */
.control-panel-content::-webkit-scrollbar {
  width: 8px;
}

.control-panel-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.control-panel-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.control-panel-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 深色模式滚动条样式 */
.body--dark .control-panel-content::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.body--dark .control-panel-content::-webkit-scrollbar-thumb {
  background: #666;
}

.body--dark .control-panel-content::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>
