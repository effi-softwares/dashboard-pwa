const CACHE_NAME = "effi-rental-dashboard-cache-v1";

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return await cache.addAll(["/", "/offline.html"]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return await Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip caching for upload-related requests
  if (
    url.pathname.startsWith("/api/uploads/") ||
    url.hostname.includes("blob.vercel-storage.com")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(event.request);
        } catch (e) {
          return caches.match("/offline.html");
        }
      })()
    );
  }
});
