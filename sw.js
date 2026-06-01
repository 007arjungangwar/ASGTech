const CACHE_NAME = "asg-tech-v68";
const urlsToCache = [
    "/learning-with-arjun/",
    "/learning-with-arjun/index.html",
    "/learning-with-arjun/manifest.json",
    "/learning-with-arjun/icon.svg",
    "/learning-with-arjun/style.css",
    "/learning-with-arjun/auth-check.js"
];

self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
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
    const isStaticAsset = /\.(?:css|js|svg|png|webp|avif|jpg|jpeg|gif|woff2?)$/i.test(requestUrl.pathname);

    event.respondWith(
        fetch(event.request, { cache: isHtmlPage ? "no-store" : "default" })
            .then((response) => {
                if ((isStaticAsset || isHtmlPage) && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
