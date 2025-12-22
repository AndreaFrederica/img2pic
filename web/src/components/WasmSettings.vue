<template>
  <q-expansion-item
    :label="$t('wasm.title')"
    icon="speed"
    class="q-mb-md"
  >
    <q-card flat bordered class="q-pa-md">
      <!-- WASM 开关 -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-body2">{{ $t('wasm.enableWasm') }}</div>
          <div class="text-caption text-grey">{{ $t('wasm.enableWasmDesc') }}</div>
        </div>
        <q-toggle
          v-model="wasmEnabled"
          color="primary"
          :disable="!isSupported"
          @update:model-value="onToggleWasm"
        />
      </div>

      <!-- 支持状态 -->
      <q-banner
        v-if="!isSupported"
        class="bg-warning text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="warning" />
        </template>
        {{ $t('wasm.notSupported') }}
      </q-banner>

      <!-- 加载状态 -->
      <q-banner
        v-else-if="wasmState === 'loading'"
        class="bg-info text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="download" />
        </template>
        {{ $t('wasm.loading') }}
      </q-banner>

      <!-- 加载成功 -->
      <q-banner
        v-else-if="wasmEnabled && wasmState === 'loaded'"
        class="bg-positive text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="check_circle" />
        </template>
        {{ $t('wasm.loaded') }}
      </q-banner>

      <!-- 加载错误 -->
      <q-banner
        v-else-if="wasmError"
        class="bg-negative text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ $t('wasm.error') }}: {{ wasmError?.message }}
      </q-banner>

      <!-- 性能提示 -->
      <q-separator class="q-my-md" />

      <div class="text-body2 q-mb-sm">{{ $t('wasm.performanceInfo') }}</div>
      <div class="text-caption text-grey">
        <ul>
          <li>{{ $t('wasm.performanceConvolution') }}</li>
          <li>{{ $t('wasm.performanceSobel') }}</li>
          <li>{{ $t('wasm.performanceSampling') }}</li>
        </ul>
      </div>

      <!-- 预加载按钮 -->
      <q-btn
        v-if="isSupported && wasmState !== 'loaded'"
        :label="$t('wasm.preload')"
        color="secondary"
        outline
        class="q-mt-md"
        :loading="wasmState === 'loading'"
        @click="onPreloadWasm"
      />
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  setWasmEnabled,
  isWasmEnabled,
  isWasmSupported,
  getWasmState,
  getWasmError,
  preloadWasm
} from '../pixel/wasmApi';

const { t } = useI18n();

// 状态
const wasmEnabled = ref(false);
const isSupported = ref(false);
const wasmState = ref<'unloaded' | 'loading' | 'loaded' | 'error'>('unloaded');
const wasmError = ref<Error | null>(null);

// 初始化
onMounted(() => {
  isSupported.value = isWasmSupported();
  wasmEnabled.value = isWasmEnabled();
  updateState();

  // 每秒更新状态
  const interval = setInterval(() => {
    updateState();
  }, 1000);

  // 清理
  return () => clearInterval(interval);
});

function updateState() {
  wasmState.value = getWasmState();
  wasmError.value = getWasmError();
}

async function onToggleWasm(value: boolean) {
  setWasmEnabled(value);
  if (value && isSupported.value) {
    // 启用 WASM 时自动加载
    await preloadWasm();
    updateState();
  }
}

async function onPreloadWasm() {
  await preloadWasm();
  updateState();
}
</script>

<i18n>
{
  "en-US": {
    "wasm": {
      "title": "WASM Acceleration",
      "enableWasm": "Enable WASM Acceleration",
      "enableWasmDesc": "Use WebAssembly for faster image processing",
      "notSupported": "WebAssembly is not supported in your browser",
      "loading": "Loading WASM module...",
      "loaded": "WASM module loaded successfully!",
      "error": "Failed to load WASM module",
      "preload": "Preload WASM Module",
      "performanceInfo": "WASM acceleration improves performance for:",
      "performanceConvolution": "Large image convolution (2-5x faster)",
      "performanceSobel": "Edge detection (2-3x faster)",
      "performanceSampling": "Pixel sampling (1.5-2x faster)"
    }
  },
  "zh-CN": {
    "wasm": {
      "title": "WASM 加速",
      "enableWasm": "启用 WASM 加速",
      "enableWasmDesc": "使用 WebAssembly 加速图像处理",
      "notSupported": "您的浏览器不支持 WebAssembly",
      "loading": "正在加载 WASM 模块...",
      "loaded": "WASM 模块加载成功！",
      "error": "WASM 模块加载失败",
      "preload": "预加载 WASM 模块",
      "performanceInfo": "WASM 加速可提升以下操作的性能：",
      "performanceConvolution": "大图像卷积运算（2-5倍速度）",
      "performanceSobel": "边缘检测（2-3倍速度）",
      "performanceSampling": "像素采样（1.5-2倍速度）"
    }
  }
}
</i18n>
