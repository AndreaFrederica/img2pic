/*
 * PWA Boot File
 * This file registers the service worker for the PWA
 */

export default async () => {
  console.log('[PWA] boot start', {
    nodeEnv: process.env.NODE_ENV,
    devPwa: process.env.DEV_PWA,
    viteDevPwa: import.meta.env.DEV_PWA
  });
  // Always enable PWA in development when using dev:pwa command
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.DEV_PWA === 'true' ||
    import.meta.env.DEV_PWA === 'true'
  ) {
    try {
      // Import the service worker registration file
      await import('../../src-pwa/register-service-worker.js');
      console.log('[PWA] boot loaded service worker registration');
    } catch (error) {
      console.error('Failed to load PWA:', error);
    }
  } else {
    console.log('[PWA] disabled in development mode. Set DEV_PWA=true to enable.');
  }
};
