// هذا هو Service Worker الخاص بتطبيق مكتوبة

const CACHE_NAME = 'maktouba-v1';
const urlsToCache = [
  '/Maktouba/',
  '/Maktouba/index.html',
  '/Maktouba/manifest.json',
  '/Maktouba/icon-192.png',
  '/Maktouba/icon-512.png',
  '/Maktouba/style.css',
  '/Maktouba/script.js',
  '/Maktouba/quran.js'
];

// تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
  );
});

// اعتراض الطلبات وإرجاع الملفات من التخزين المؤقت عند عدم وجود اتصال
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع الملف من التخزين المؤقت إذا وجد، وإلا تحميله من الشبكة
        return response || fetch(event.request);
      })
  );
});

// تحديث Service Worker وحذف التخزين المؤقت القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});