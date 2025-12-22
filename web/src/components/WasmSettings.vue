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
          v-model="settingsStore.wasmEnabled"
          color="primary"
          :disable="!isSupported"
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
        <q-spinner-dots class="float-right" />
      </q-banner>

      <!-- 加载成功 -->
      <q-banner
        v-else-if="settingsStore.wasmEnabled && wasmState === 'loaded'"
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

      <!-- 未加载提示 -->
      <q-banner
        v-else-if="settingsStore.wasmEnabled && wasmState === 'unloaded'"
        class="bg-grey-8 text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        {{ $t('wasm.notLoaded') }}
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
        :loading="wasmState === 'loading' || wasmState === 'unloaded'"
        @click="onPreloadWasm"
      />
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '../stores/settings';
import {
  isWasmSupported,
  getWasmState,
  getWasmError,
  preloadWasm
} from '../pixel/wasmApi';

const settingsStore = useSettingsStore();

// 状态
const isSupported = ref(false);
const wasmState = ref<'unloaded' | 'loading' | 'loaded' | 'error'>('unloaded');
const wasmError = ref<Error | null>(null);
let updateInterval: ReturnType<typeof setInterval> | null = null;

// 初始化
onMounted(() => {
  isSupported.value = isWasmSupported();
  updateState();

  // 每秒更新状态
  updateInterval = setInterval(() => {
    updateState();
  }, 500);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

function updateState() {
  wasmState.value = getWasmState();
  wasmError.value = getWasmError();
}

async function onPreloadWasm() {
  await preloadWasm();
  updateState();
}
</script>
