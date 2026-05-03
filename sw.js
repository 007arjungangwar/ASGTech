const CACHE_NAME = "asg-tech-v8";
const urlsToCache = [
    "/learning-with-arjun/",
    "/learning-with-arjun/index.html",
    "/learning-with-arjun/style.css",
    "/learning-with-arjun/auth-check.js",
    "/learning-with-arjun/learning-data.js",
    "/learning-with-arjun/login.html",
    "/learning-with-arjun/admin.html",
    "/learning-with-arjun/quiz.html",
    "/learning-with-arjun/coding-practice.html"
];

self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.all(
                urlsToCache.map((url) => cache.add(new Request(url, { cache: "reload" })))
            ))
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

    event.respondWith(
        fetch(event.request, { cache: "no-store" })
            .then((response) => {
                if (!isHtmlPage && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
