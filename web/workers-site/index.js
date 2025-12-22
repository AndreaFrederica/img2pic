/**
 * Cloudflare Workers script for serving static files
 * This script handles requests to your img2pic web application
 */

import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

// Cache configuration
const CACHE_TTL = {
  html: 60 * 60 * 2, // 2 hours
  css: 60 * 60 * 24 * 30, // 30 days
  js: 60 * 60 * 24 * 30, // 30 days
  images: 60 * 60 * 24 * 30, // 30 days
  fonts: 60 * 60 * 24 * 30, // 30 days
  default: 60 * 60 * 2, // 2 hours
};

/**
 * Main fetch handler for the worker
 */
export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx);
    } catch (e) {
      console.error('Worker error:', e);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

/**
 * Handle the fetch request
 */
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle API routes if needed
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, pathname);
  }

  // Handle static assets
  return handleAssetRequest(request, pathname, env, ctx);
}

/**
 * Handle API requests
 */
async function handleApiRequest(request, pathname) {
  // Example API endpoint
  if (pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // 404 for other API endpoints
  return new Response('API endpoint not found', { status: 404 });
}

/**
 * Handle static asset requests
 */
async function handleAssetRequest(request, pathname, env, ctx) {
  // Default to index.html for SPA routing
  if (pathname === '/' || !pathname.includes('.')) {
    const url = new URL(request.url);
    url.pathname = '/index.html';
    request = new Request(url, request);
  }

  try {
    // Get asset from KV storage
    const asset = await getAssetFromKV(request, {
      ASSET_NAMESPACE: env.ASSETS,
      ASSET_MANIFEST: env.ASSET_MANIFEST,
    });

    // Determine content type and set cache headers
    const contentType = asset.headers.get('content-type') || 'text/plain';
    const cacheTime = getCacheTime(contentType, pathname);

    // Create response with proper headers
    const response = new Response(asset.body, asset);

    // Cache headers
    response.headers.set('Cache-Control', `public, max-age=${cacheTime}`);

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  } catch (e) {
    console.error('Asset error:', e);

    // If asset not found, try to serve index.html for SPA routing
    if (shouldServeIndex(pathname)) {
      try {
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        const indexAsset = await getAssetFromKV(indexRequest, {
          ASSET_NAMESPACE: env.ASSETS,
          ASSET_MANIFEST: env.ASSET_MANIFEST,
        });

        const response = new Response(indexAsset.body, indexAsset);
        response.headers.set('Cache-Control', `public, max-age=${CACHE_TTL.html}`);
        return response;
      } catch (indexError) {
        console.error('Index asset error:', indexError);
        return new Response('Application not found', { status: 404 });
      }
    }

    return new Response('Asset not found', { status: 404 });
  }
}

/**
 * Get cache time based on content type
 */
function getCacheTime(contentType, pathname) {
  if (contentType.includes('text/html')) return CACHE_TTL.html;
  if (contentType.includes('text/css')) return CACHE_TTL.css;
  if (contentType.includes('application/javascript')) return CACHE_TTL.js;
  if (contentType.includes('image/')) return CACHE_TTL.images;
  if (contentType.includes('font/')) return CACHE_TTL.fonts;

  // Check file extensions as fallback
  if (pathname.match(/\.(css|js)$/)) return CACHE_TTL.css;
  if (pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) return CACHE_TTL.images;
  if (pathname.match(/\.(woff|woff2|ttf|eot)$/)) return CACHE_TTL.fonts;

  return CACHE_TTL.default;
}

/**
 * Check if should serve index.html for SPA routing
 */
function shouldServeIndex(pathname) {
  // Don't serve index for static assets
  if (pathname.includes('.')) return false;

  // Don't serve index for API routes
  if (pathname.startsWith('/api/')) return false;

  // Serve index for all other routes (SPA routing)
  return true;
}
