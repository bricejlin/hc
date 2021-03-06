(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../libs/caches":2}],2:[function(require,module,exports){
if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();
      
      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

if (!CacheStorage.prototype.match) {
  // This is probably vulnerable to race conditions (removing caches etc)
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this;

    return this.keys().then(function(cacheNames) {
      var match;

      return cacheNames.reduce(function(chain, cacheName) {
        return chain.then(function() {
          return match || caches.open(cacheName).then(function(cache) {
            return cache.match(request, opts);
          }).then(function(response) {
            match = response;
            return match;
          });
        });
      }, Promise.resolve());
    });
  };
}

module.exports = self.caches;
},{}]},{},[1]);
