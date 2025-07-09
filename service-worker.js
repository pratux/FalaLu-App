const CACHE_NAME = 'rastelli-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './Logotipo_Rastelli.jpg',
  './avatarLu2.jpg',
  './manifest.json',
  './favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
