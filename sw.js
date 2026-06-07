const CACHE_NAME = "asg-tech-v70";

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) return;

    const isHtmlPage = event.request.mode === "navigate" || requestUrl.pathname.endsWith(".html");
    const isLocalAsset = /\.(?:css|js|svg|png|jpg|jpeg|webp|json)$/i.test(requestUrl.pathname);

    if (isLocalAsset && !isHtmlPage) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const freshResponse = fetch(event.request)
                    .then((response) => {
                        if (response.ok) {
                            const copy = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                        }
                        return response;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || freshResponse;
            })
        );
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
