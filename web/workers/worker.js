export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let res = await env.ASSETS.fetch(request);
    if (res.status === 404 && !url.pathname.includes('.')) {
      const indexUrl = new URL('/index.html', url.origin);
      res = await env.ASSETS.fetch(new Request(indexUrl, request));
    }
    return res;
  },
};