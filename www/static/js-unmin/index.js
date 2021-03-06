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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/hc/sw.js', {scope: '/hc/'})
    .then(function (reg) {
      console.log(':D', reg);
    }).catch(function (err) {
      console.log(':(', err);
    });
}
