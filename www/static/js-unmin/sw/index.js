var caches = require('../libs/caches');

var HC_CACHE = 'static-hc-v1';
var urlsToCache = [
  '/hc/',
  '/hc/static/css/all.css',
  '/hc/static/imgs/favicon.ico',
  '/hc/static/imgs/hc.png',
  '/hc/static/js/main.js',
  '/hc/static/hcat.json',
  '/hc/static/fonts/source400.woff2',
  '/hc/static/fonts/source600.woff2',
  new Request('https://api.reftagger.com/v2/RefTagger.js', { mode: 'no-cors' })
];

self.addEventListener('install', function (event) {
  // pre cache a load of stuff
  event.waitUntil(
    caches.open(HC_CACHE).then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  var cacheWhitelist = [HC_CACHE];

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
      // cache hit - return response
      if (res) { return res; }

      var fetchReq = event.request.clone();

      // save req to cache
      return fetch(fetchReq).then(function (res) {
        if (!res || res.status !== 200 || res.type !== 'basic') { return res; }

        var resToCache = res.clone();

        caches.open(HC_CACHE).then(function (cache) {
          var cacheReq = event.request.clone();
          cache.put(cacheReq, resToCache);
        });

        return res;
      });
    })
  );
});
