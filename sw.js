const CACHE_NAME = 'jadwal-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './manifest.json'
  // Masukkan nama file icon kamu di sini nanti, misal: './icon-192.png'
];

// Saat aplikasi pertama diinstal, simpan file HTML ke memori
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Saat internet mati, ambil file HTML dari memori
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kalau file ada di cache, pakai yang di cache. Kalau nggak, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});
