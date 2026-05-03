const CACHE_NAME = "asg-tech-v3";
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

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, copy));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
