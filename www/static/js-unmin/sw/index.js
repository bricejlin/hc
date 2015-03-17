var caches = require('../libs/caches');
//v2
var CACHE_NAME = 'static-v1';
var urlsToCache = [
  '/hc/',
  '/hc/static/css/all.css',
  '/hc/static/imgs/favicon.ico',
  '/hc/static/imgs/hc.png',
  '/hc/static/js/main.js',
  '/hc/static/hcat.json'
  // new Request('http://dragon.ak.fbcdn.net/hphotos-ak-xpf1/t39.3284-6/10574688_1565081647062540_1607884640_n.js', {mode: 'no-cors'}),
  // new Request('https://fb.me/JSXTransformer-0.12.2.js', {mode: 'no-cors'}),
  // new Request('https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', {mode: 'no-cors'}),
  // '/js/main.js'
];

self.addEventListener('install', function (event) {
  // pre cache a load of stuff
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  var cacheWhitelist = ['static-v1'];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (res) {
      return res || fetch(event.request);
    })
  );
});

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (res) {
//       // cache hit - return response
//       if (res) { return res; }

//       var fetchReq = event.request.clone();

//       return fetch(fetchReq).then(function (res) {
//         if (!res || res.status !== 200 || res.type !== 'basic') { return res; }

//         var resToCache = res.clone();

//         caches.open(CACHE_NAME).then(function (cache) {
//           var cacheReq = event.request.clone();
//           cache.put(cacheReq, resToCache);
//         });

//         return res;
//       });
//     })
//   );
// });
