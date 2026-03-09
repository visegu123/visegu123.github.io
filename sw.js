// Ganti angka v1, v2, v3 setiap kali kamu mengubah kodingan HTML/CSS!
const CACHE_NAME = 'jadwal-cache-v2'; 
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './manifest.json'
];

// 1. Install & Langsung Aktifkan
self.addEventListener('install', event => {
  self.skipWaiting(); // Memaksa update tanpa harus nunggu browser ditutup
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 2. Bersih-bersih Cache Lama (Biar gak menuhi memori HP)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache versi lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Strategi: Tanya Internet Dulu (Network First)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Kalau internet nyala, simpan kodingan terbaru ke gudang (cache)
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response; // Tampilkan versi terbaru
      })
      .catch(() => {
        // Kalau internet MATI/ERROR, baru ambil fotokopian dari gudang (cache)
        return caches.match(event.request);
      })
  );
});
