<template>
  <div>
    <!-- Debug PWA Install Button (for testing) -->
    <q-btn
      v-if="!isInstalled()"
      flat
      color="primary"
      label="安装PWA应用"
      icon="download"
      @click="showInstallPrompt = true"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;"
    />

    <!-- Debug Status Display -->
    <div style="position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; font-size: 12px; z-index: 1000;">
      <div>PWA状态:</div>
      <div>已安装: {{ isInstalled() ? '是' : '否' }}</div>
      <div>离线: {{ isOffline ? '是' : '否' }}</div>
      <div>有安装提示: {{ deferredPrompt ? '是' : '否' }}</div>
    </div>

    <!-- PWA Install Prompt -->
    <q-dialog v-model="showInstallPrompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar
            icon="apps"
            color="primary"
            text-color="white"
            size="lg"
          />
          <div class="q-ml-md">
            <div class="text-h6">安装 img2pic 应用</div>
            <div class="text-body2 text-grey-7">
              将 img2pic 安装到您的设备，随时随地使用像素画转换功能！
            </div>
          </div>
        </q-card-section>

        <q-card-section class="text-body2">
          <ul class="q-pl-md">
            <li>离线使用，无需网络连接</li>
            <li>全屏体验，更专注的工作环境</li>
            <li>启动更快，即开即用</li>
            <li>获得所有最新功能更新</li>
          </ul>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="以后再说"
            color="grey"
            @click="dismissInstallPrompt"
            v-close-popup
          />
          <q-btn
            flat
            label="安装应用"
            color="primary"
            @click="installPWA"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Update Available Dialog -->
    <q-dialog v-model="showUpdateDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar
            icon="system_update"
            color="positive"
            text-color="white"
            size="lg"
          />
          <div class="q-ml-md">
            <div class="text-h6">新版本可用</div>
            <div class="text-body2 text-grey-7">
              img2pic 有新版本更新，包含改进和新功能！
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="稍后更新"
            color="grey"
            @click="dismissUpdate"
            v-close-popup
          />
          <q-btn
            flat
            label="立即更新"
            color="primary"
            @click="applyUpdate"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Offline Notification -->
    <q-banner
      v-if="isOffline"
      class="bg-warning text-white"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="wifi_off" />
      </template>
      <div class="text-body2">
        离线模式：正在使用缓存版本运行，部分功能可能受限
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar, type QNotifyCreateOptions } from 'quasar';
import type { Workbox } from 'workbox-window';

type BeforeInstallPromptOutcome = 'accepted' | 'dismissed';

interface BeforeInstallPromptResult {
  outcome: BeforeInstallPromptOutcome;
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<BeforeInstallPromptResult>;
  userChoice: Promise<BeforeInstallPromptResult>;
}

const $q = useQuasar();

// Refs
const showInstallPrompt = ref(false);
const showUpdateDialog = ref(false);
const isOffline = ref(false);
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const swRegistration = ref<Workbox | null>(null);

// Check if app is already installed
const isInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (navigator as Navigator & { standalone?: boolean }).standalone === true;
};

// Show install prompt
const showInstallPromptDialog = (prompt: BeforeInstallPromptEvent) => {
  console.log('[PWA] beforeinstallprompt fired', {
    hasPrompt: typeof prompt?.prompt === 'function'
  });
  if (!isInstalled() && !localStorage.getItem('pwa-install-dismissed')) {
    deferredPrompt.value = prompt;
    showInstallPrompt.value = true;
  }
};

// Dismiss install prompt
const dismissInstallPrompt = () => {
  localStorage.setItem('pwa-install-dismissed', 'true');
  deferredPrompt.value = null;
};

// Install PWA
const installPWA = async () => {
  const promptEvent = deferredPrompt.value;
  console.log('[PWA] install click', {
    hasDeferredPrompt: Boolean(promptEvent)
  });
  if (!promptEvent) return;

  try {
    const result = await promptEvent.prompt();
    console.log('[PWA] install result', result);

    if (result.outcome === 'accepted') {
      $q.notify({
        type: 'positive',
        message: '应用安装成功！',
        icon: 'check_circle',
        position: 'top'
      } as QNotifyCreateOptions);
    }

    deferredPrompt.value = null;
  } catch (error) {
    console.error('PWA installation failed:', error);
    $q.notify({
      type: 'negative',
      message: '应用安装失败，请重试',
      icon: 'error',
      position: 'top'
    } as QNotifyCreateOptions);
  }
};

// Show update dialog
const showUpdateAvailableDialog = (registration: Workbox) => {
  swRegistration.value = registration;
  showUpdateDialog.value = true;
};

// Dismiss update
const dismissUpdate = () => {
  // Will update on next page load
  swRegistration.value = null;
};

// Apply update
const applyUpdate = () => {
  const workbox = swRegistration.value;
  console.log('[PWA] apply update', {
    hasWorkbox: Boolean(workbox)
  });
  if (!workbox) return;
  const handleControlling = () => {
    workbox.removeEventListener('controlling', handleControlling);
    window.location.reload();
  };
  workbox.addEventListener('controlling', handleControlling);
  workbox.messageSkipWaiting();
};

const handleBeforeInstallPrompt = (event: Event) => {
  console.log('[PWA] beforeinstallprompt event', event);
  event.preventDefault();
  showInstallPromptDialog(event as BeforeInstallPromptEvent);
};

const handleSwUpdateAvailable = (event: Event) => {
  console.log('[PWA] sw-update-available event', event);
  const updateEvent = event as CustomEvent<Workbox>;
  if (updateEvent.detail) {
    showUpdateAvailableDialog(updateEvent.detail);
  }
};

// Check online/offline status
const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine;

  if (isOffline.value) {
    $q.notify({
      type: 'warning',
      message: '应用已切换到离线模式',
      icon: 'wifi_off',
      position: 'bottom',
      timeout: 3000
    } as QNotifyCreateOptions);
  } else {
    $q.notify({
      type: 'positive',
      message: '网络连接已恢复',
      icon: 'wifi',
      position: 'bottom',
      timeout: 2000
    } as QNotifyCreateOptions);
  }
};

onMounted(() => {
  console.log('[PWA] mounted', {
    isInstalled: isInstalled(),
    isOffline: isOffline.value
  });
  // Check initial online status
  isOffline.value = !navigator.onLine;

  // Listen for online/offline events
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Listen for PWA install prompt
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    $q.notify({
      type: 'positive',
      message: 'img2pic 已成功安装到您的设备！',
      icon: 'celebration',
      position: 'top',
      timeout: 4000
    } as QNotifyCreateOptions);
    showInstallPrompt.value = false;
    deferredPrompt.value = null;
  });

  // Listen for service worker updates
  window.addEventListener('sw-update-available', handleSwUpdateAvailable);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('sw-update-available', handleSwUpdateAvailable);
});
</script>

<style scoped>
.q-banner {
  margin-bottom: 8px;
}
</style>
