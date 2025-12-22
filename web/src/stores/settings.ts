import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const shouldShowPinchCenter = ref(false);

  return {
    shouldShowPinchCenter,
  };
});
