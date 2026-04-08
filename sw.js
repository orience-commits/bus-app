const CACHE_NAME = "bus-app-v2"; // ← 更新したら数字変える

const urlsToCache = [
  "./",
  "index.html",
  "stops.txt",
  "stop_times.txt",
  "trips.txt",
  "routes.txt",
  "shapes.txt",
  "icon.png"
];

// インストール
self.addEventListener("install", e => {
  self.skipWaiting(); // すぐ反映

  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 古いキャッシュ削除
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// フェッチ
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
