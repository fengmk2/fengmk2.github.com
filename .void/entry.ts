import app, { scheduled } from 'virtual:void-routes';

async function serveWithAssets(request, env, response) {
  if (response.status !== 404 || !env.ASSETS) return response;
  const asset = await env.ASSETS.fetch(request);
  if (asset.status === 404) return response;
  const res = new Response(asset.body, asset);
  if (new URL(request.url).pathname.startsWith("/assets/")) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    res.headers.set("Cache-Control", "public, s-maxage=60, max-age=0, must-revalidate");
  }
  return res;
}

export default { fetch: async (request, env, ctx) => serveWithAssets(request, env, await app.fetch(request, env, ctx)), scheduled };