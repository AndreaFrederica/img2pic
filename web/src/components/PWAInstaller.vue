<template>
  <div>
    <!-- PWA Install Button -->
    <q-btn
      v-if="!isInstalled()"
      flat
      color="primary"
      label="安装PWA应用"
      icon="download"
      @click="showInstallPrompt = true"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;"
    />

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
const pwaInstallable = ref(false); // 浏览器是否支持 PWA 安装
const beforeInstallPromptFired = ref(false); // beforeinstallprompt 事件是否触发过

// Check if app is already installed
const isInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (navigator as Navigator & { standalone?: boolean }).standalone === true;
};

// 检查浏览器是否支持 PWA 安装
const checkPWAInstallable = async () => {
  // 检查是否已安装
  if (isInstalled()) {
    pwaInstallable.value = false;
    return false;
  }

  // 检查是否是 HTTPS
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    console.log('[PWA] Not HTTPS, PWA not installable');
    return false;
  }

  // 检查 Service Worker 支持
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return false;
  }

  // 检查 manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (!manifestLink) {
    console.log('[PWA] No manifest link found');
    return false;
  }

  // 尝试获取 manifest 验证是否可访问
  try {
    const manifestHref = (manifestLink as HTMLLinkElement).href;
    const response = await fetch(manifestHref);
    if (!response.ok) {
      console.log('[PWA] Manifest fetch failed', response.status);
      return false;
    }
    const manifest = await response.json();
    console.log('[PWA] Manifest loaded', manifest);
  } catch (e) {
    console.log('[PWA] Manifest fetch error', e);
    return false;
  }

  // 检查是否有 beforeinstallPrompt 事件支持
  // 这个事件是判断是否可安装的最可靠方式
  if (beforeInstallPromptFired.value) {
    pwaInstallable.value = true;
    return true;
  }

  // 某些浏览器（如 iOS Safari）不支持 beforeinstallPrompt
  // 需要判断是否有 manifest 和 service worker
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  if (isIOS && navigatorWithStandalone.standalone !== true) {
    pwaInstallable.value = true;
    return true;
  }

  return false;
};

// Show install prompt
const showInstallPromptDialog = (prompt: BeforeInstallPromptEvent) => {
  console.log('[PWA] beforeinstallprompt fired', {
    hasPrompt: typeof prompt?.prompt === 'function'
  });
  beforeInstallPromptFired.value = true;
  pwaInstallable.value = true;
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

  // 没有保存的安装事件，显示手动安装引导
  if (!promptEvent) {
    void showManualInstallGuide();
    return;
  }

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

// 显示手动安装引导
const showManualInstallGuide = async () => {
  // 先检测 PWA 是否可安装
  const installable = await checkPWAInstallable();

  if (!installable) {
    // PWA 不可安装，显示原因
    let reason = '';

    if (isInstalled()) {
      reason = '应用已经安装了！';
    } else if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      reason = 'PWA 需要 HTTPS 环境才能安装。<br>请使用 HTTPS 访问或在本地测试。';
    } else if (!('serviceWorker' in navigator)) {
      reason = '当前浏览器不支持 Service Worker，无法安装 PWA。<br>请使用 Chrome、Edge、Safari 等现代浏览器。';
    } else {
      reason = '当前环境不支持 PWA 安装。<br>请确保：<br>1. 使用 HTTPS 访问<br>2. 使用现代浏览器（Chrome、Edge、Safari）<br>3. Manifest 文件正确配置';
    }

    $q.dialog({
      title: '无法安装',
      message: reason,
      html: true,
      ok: {
        label: '知道了',
        flat: true,
        color: 'grey'
      }
    });
    return;
  }

  // PWA 可安装，显示引导
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|OPR/.test(navigator.userAgent);
  const isEdge = /Edge/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  let guideTitle = '手动安装应用';
  let guideMessage = '';

  if (isIOS) {
    guideTitle = 'iOS 安装指南';
    guideMessage = `
      <div style="text-align: left; line-height: 1.8;">
        <ol style="margin: 0; padding-left: 20px;">
          <li>点击浏览器地址栏中的 <strong>"分享"</strong> 按钮 📤</li>
          <li>向下滚动找到 <strong>"添加到主屏幕"</strong></li>
          <li>点击右上角的 <strong>"添加"</strong> 按钮</li>
        </ol>
      </div>
    `;
  } else if (isChrome || isEdge) {
    guideTitle = 'Chrome/Edge 浏览器安装';
    guideMessage = `
      <div style="text-align: left; line-height: 1.8;">
        <ol style="margin: 0; padding-left: 20px;">
          <li>点击浏览器地址栏右侧的 <strong>"安装"</strong> 图标 🔽</li>
          <li>或者点击右上角菜单 <strong>⋮</strong> → <strong>"安装 img2pic"</strong></li>
          <li>点击安装按钮即可</li>
        </ol>
        <div style="margin-top: 12px; padding: 8px; background: rgba(0,200,0,0.1); border-radius: 4px;">
          <small>✅ 当前环境支持 PWA 安装</small>
        </div>
      </div>
    `;
  } else if (isSafari) {
    guideTitle = 'Safari 浏览器安装';
    guideMessage = `
      <div style="text-align: left; line-height: 1.8;">
        <ol style="margin: 0; padding-left: 20px;">
          <li>点击浏览器地址栏中的 <strong>"分享"</strong> 按钮 📤</li>
          <li>向下滚动找到 <strong>"添加到主屏幕"</strong></li>
          <li>点击右上角的 <strong>"添加"</strong> 按钮</li>
        </ol>
      </div>
    `;
  } else {
    guideMessage = `
      <div style="text-align: left; line-height: 1.8;">
        <p>✅ 当前环境支持 PWA 安装</p>
        <p>请在浏览器菜单中查找 <strong>"安装应用"</strong> 或 <strong>"添加到主屏幕"</strong> 选项。</p>
      </div>
    `;
  }

  $q.dialog({
    title: guideTitle,
    message: guideMessage,
    html: true,
    ok: {
      label: '知道了',
      flat: true,
      color: 'primary'
    }
  });
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

onMounted(async () => {
  // Check initial online status
  isOffline.value = !navigator.onLine;

  // 检测 PWA 是否可安装
  await checkPWAInstallable();

  // 输出 PWA 状态到控制台
  console.log(
    '%c[PWA] 状态',
    'color: #027be3; font-weight: bold; font-size: 14px;'
  );
  console.log('  已安装:', isInstalled() ? '是' : '否');
  console.log('  离线:', isOffline.value ? '是' : '否');
  console.log('  可安装:', pwaInstallable.value ? '是' : '否');
  console.log('  beforeinstallprompt:', beforeInstallPromptFired.value ? '已触发' : '未触发');
  console.log('  deferredPrompt:', deferredPrompt.value ? '有' : '无');
  console.log(
    '%c运行 $0.pwaStatus 查看状态',
    'color: #666; font-style: italic;'
  );

  // 将状态挂载到 window 以便调试
  (window as { pwaStatus?: unknown }).pwaStatus = {
    isInstalled: isInstalled(),
    isOffline: isOffline.value,
    pwaInstallable: pwaInstallable.value,
    beforeInstallPromptFired: beforeInstallPromptFired.value,
    hasDeferredPrompt: !!deferredPrompt.value
  };

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
    pwaInstallable.value = false;
    (window as { pwaStatus?: unknown }).pwaStatus = {
      isInstalled: true,
      isOffline: isOffline.value,
      pwaInstallable: false,
      beforeInstallPromptFired: beforeInstallPromptFired.value,
      hasDeferredPrompt: false
    };
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
