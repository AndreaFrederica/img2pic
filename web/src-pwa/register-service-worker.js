/*
 * Service Worker Registration for img2pic PWA
 */

import { Workbox } from 'workbox-window';

const isProduction = process.env.NODE_ENV === 'production';

// Function to show update notification
function showUpdateUI(workbox) {
  // You can use Quasar's Notify plugin or a custom UI component
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('img2pic - 新版本可用', {
      body: '点击刷新以获取最新版本',
      icon: '/icons/icon-192x192.png',
      tag: 'app-update'
    }).onclick = () => {
      window.location.reload();
    };
  }

  // Also emit a custom event that your Vue app can listen for
  window.dispatchEvent(new CustomEvent('sw-update-available', {
    detail: workbox
  }));
}

// Register the service worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox(process.env.SERVICE_WORKER_FILE);

  // Service Worker events
  wb.addEventListener('install', () => {
    console.log('Service Worker installing...');
  });

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      console.log('Service Worker has been updated.');
    } else {
      console.log('Service Worker has been installed for the first time.');
    }
  });

  wb.addEventListener('activated', () => {
    console.log('Service Worker activated.');
  });

  wb.addEventListener('controlling', () => {
    console.log('Service Worker is controlling the page.');
  });

  wb.addEventListener('externalactivated', () => {
    console.log('Service Worker was activated on another page.');
  });

  wb.addEventListener('externalinstalled', () => {
    console.log('Service Worker was installed on another page.');
  });

  wb.addEventListener('externalwaiting', () => {
    console.log('Service Worker is waiting on another page.');
  });

  // Handle updates
  wb.addEventListener('waiting', () => {
    console.log('A new version is available; please refresh.');
    showUpdateUI(wb);
  });

  wb.addEventListener('redundant', () => {
    console.log('The installing service worker became redundant.');
  });

  // Register the service worker
  wb.register()
    .then(() => {
      if (isProduction) {
        console.log('img2pic PWA is ready to work offline!');
      }
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);

      // Show error notification in production
      if (isProduction && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('img2pic - 服务错误', {
          body: '服务注册失败，某些功能可能无法正常使用',
          icon: '/icons/icon-192x192.png',
          tag: 'sw-error'
        });
      }
    });

  // Listen for online/offline status
  window.addEventListener('online', () => {
    console.log('App is online.');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('img2pic - 网络连接', {
        body: '网络连接已恢复',
        icon: '/icons/icon-192x192.png',
        tag: 'online-status'
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('App is offline.');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('img2pic - 离线模式', {
        body: '应用正在离线模式下运行，某些功能可能受限',
        icon: '/icons/icon-192x192.png',
        tag: 'offline-mode'
      });
    }
  });

  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
  }

  // Make workbox instance available globally for debugging
  window.workbox = wb;
} else {
  console.log('Service Workers are not supported in this browser.');
}
