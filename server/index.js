var express = require('express');
var swig = require('swig');
var path = require('path');

var app = express();

app.engine('html', swig.renderFile);
// app.set('view cache', false);
// swig.setDefaults({ cache: false });

app.use('/hc/static', express.static(__dirname + '/../www/static'));

app.get('/hc', function (req, res) {
  res.render('../www/index.html');
});

app.get('/hc/manifest.json', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../manifest.json'));
});

app.get('/hc/sw.js', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../www/static/js/sw.js'));
});

module.exports = app;