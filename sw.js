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
const MIYAKO = {
  lat: 24.8055,
  lon: 125.2811
}

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const showAreaMessage = () => {
  const el = document.getElementById('areaMessage')
  el.style.display = 'block'

  // 5秒後に消す
  setTimeout(() => {
    el.style.display = 'none'
  }, 5000)
}

const checkAreaAndMove = (userLat, userLon, map) => {
  const dist = getDistanceKm(userLat, userLon, MIYAKO.lat, MIYAKO.lon)

  if (dist > 50) {
    if (!localStorage.getItem('areaChecked')) {
      localStorage.setItem('areaChecked', 'true')

      const go = confirm('現在地が対象エリア外です。宮古島を表示しますか？')

      if (go) {
        map.setView([MIYAKO.lat, MIYAKO.lon], 13)
      } else {
        // キャンセル時
        showAreaMessage()
      }
    } else {
      // 2回目以降は静かにメッセージだけ出す
      showAreaMessage()
    }
  }
}navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude
  const lon = pos.coords.longitude

  checkAreaAndMove(lat, lon, map)
})

