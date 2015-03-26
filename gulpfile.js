var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var buffer = require('gulp-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var app  = require('./server');
var urlSrc = require('./url-src');

function browserifyTask (dev) {
  var b = browserify({
    debug: dev
  });
  b.transform(reactify);
  b.add('./www/static/js-unmin/index.js');
  b = b.bundle()
    .pipe(source('main.js'));

  if (!dev) {
    b = b.pipe(buffer()).pipe(uglify());
  }

  return b
    .pipe(gulp.dest('www/static/js'));
}

gulp.task('browserify-sw', function () {
  var b = browserify();
  b.add('./www/static/js-unmin/sw/index.js');
  b = b.bundle()
    .pipe(source('sw.js'));

  return b
    .pipe(gulp.dest('www/static/js'));
})

function lessTask (dev) {
  return gulp.src('www/static/less/all.less')
    .pipe(less({
      compress: dev
    }))
    .pipe(gulp.dest('www/static/css/'));
}

gulp.task('browserify', function () {
  return browserifyTask(true);
});

gulp.task('browserify-build', function () {
  return browserifyTask(false);
});

gulp.task('less', function () {
  return lessTask(false);
});

gulp.task('less-build', function () {
  return lessTask(true);
});

gulp.task('watch', ['less', 'browserify', 'browserify-sw'], function () {
  gulp.watch('www/static/less/*.less', ['less']);
  gulp.watch('www/static/js-unmin/**/*.js', ['browserify']);
  gulp.watch('www/static/js-unmin/**/*.jsx', ['browserify']);
  gulp.watch('www/static/js-unmin/sw/index.js', ['browserify-sw']);
});

gulp.task('serve', function () {
  app.listen(3000, function () {
    console.log('Listening...');
  });
});

gulp.task('clean', function () {
  gulp.src('build/*', { read: false })
    .pipe(clean());
});

gulp.task('build', ['clean', 'less-build', 'browserify-sw', 'browserify-build'], 
  function () {
  var server = app.listen(3000);
  var writeStream = gulp.dest('build/');

  writeStream.on('end', server.close.bind(server));

  return urlSrc('http://localhost:3000/hc/', [
    '',
    'static/css/all.css',
    'static/js/main.js',
    'sw.js',
    'static/imgs/favicon.ico',
    'static/imgs/hc.png',
    'static/hcat.json',
    'manifest.json',
    'static/fonts/source400.woff2',
    'static/fonts/source600.woff2',
  ]).pipe(writeStream);
});

gulp.task('default', ['watch', 'serve']);