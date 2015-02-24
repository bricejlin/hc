var Promise = require('es6-promise').Promise;
var $ = require('jquery');

require('./views/main.jsx');

$(document).ready(function () {
  setTimeout(function () {
    var vTagged = new Promise(function (resolve, reject) {
      refTagger.tag(document.body);
      resolve();
    });

    vTagged.then(function () {
      $('.rtBibleRef').click(function (e) {
        e.preventDefault();
        $(this).trigger('hover');
      });
    });
  }, 1000);
});

// var refTagger = {
//   settings: {
//     bibleVersion: "ESV",
//     dropShadow: false,
//     socialSharing: ["twitter","facebook"]
//   }
// };

// (function(d, t) {
//   var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
//   g.src = "https://api.reftagger.com/v2/RefTagger.js";
//   s.parentNode.insertBefore(g, s);
// }(document, "script"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/hc/sw.js')
    .then(function (reg) {
      console.log(':D', reg);
    }).catch(function (err) {
      console.log(':(', err);
    });
}
