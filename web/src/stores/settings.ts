import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { setWasmEnabled } from '../pixel/wasmApi';

const STORAGE_KEY_WASM_ENABLED = 'img2pic_wasm_enabled';

// 从 localStorage 加载 WASM 设置
function loadWasmSetting(): boolean {
  try {
    const value = localStorage.getItem(STORAGE_KEY_WASM_ENABLED);
    return value === 'true';
  } catch {
    return false; // 默认不启用 WASM
  }
}

// 保存 WASM 设置到 localStorage
function saveWasmSetting(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY_WASM_ENABLED, String(value));
  } catch (e) {
    console.warn('Failed to save WASM setting:', e);
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const shouldShowPinchCenter = ref(false);

  // WASM 加速设置
  const wasmEnabled = ref(loadWasmSetting());

  // 监听变化，同步到 localStorage 和 wasmApi
  watch(wasmEnabled, (newValue) => {
    saveWasmSetting(newValue);
    setWasmEnabled(newValue);
  }, { immediate: true });

  // 初始化时设置 WASM 状态
  setWasmEnabled(wasmEnabled.value);

  return {
    shouldShowPinchCenter,
    wasmEnabled,
  };
});
