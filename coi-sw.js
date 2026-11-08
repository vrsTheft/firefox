/* Adds cross-origin isolation headers on hosts that can't set them (e.g. GitHub Pages),
   so Firefox-in-WebAssembly can run inside GlassOS. Registered by GlassOS itself. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;
  e.respondWith(fetch(r).then(res => {
    if (res.status === 0) return res; // opaque responses can't be changed
    const h = new Headers(res.headers);
    h.set("Cross-Origin-Embedder-Policy", "credentialless");
    h.set("Cross-Origin-Opener-Policy", "same-origin");
    h.set("Cross-Origin-Resource-Policy", "cross-origin");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }).catch(err => { console.error(err); return Response.error(); }));
});
