var resolve = require('path').relative,
  gulp = require('gulp'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  uglifyjs = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
  webpack = require('gulp-webpack'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  symlink = require('gulp-sym');

var appPath = resolve('.', './app'),
  publicPath = resolve('.', './app/public'),
  assetsPath = resolve('.', './app/assets'),
  nodePath = resolve('.', './node_modules');

gulp.task('default', ['jade', 'make-sym', 'copy-images', 'sass', 'vendor', 'webpack']);

gulp.task('jade', function(){
  var YourLocals = {};
  gulp.src(assetsPath + '/jade/*')
    .pipe(jade({
      locals: YourLocals
    }))
    .pipe(gulp.dest(publicPath + '/html/'))
});

gulp.task('make-sym', function () {
  gulp.src(appPath + '/server')
    .pipe(symlink(nodePath + '/server', { force: true }));
});

gulp.task('copy-images', function () {
  gulp.src(assetsPath + '/images/*')
    .pipe(gulp.dest(publicPath + '/images/'));
});

gulp.task('sass', function () {
  gulp.src(assetsPath + '/sass/style.sass')
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole:true
    }))
    .pipe(uglifycss())
    .pipe(gulp.dest(publicPath + '/css/'));
});

gulp.task('webpack', ['js-clean'], function () {
  gulp.src(assetsPath + '/js/main.js')
    .pipe(uglifyjs({ mangle: false }))
    .pipe(gulp.dest(publicPath + '/js/'));
});

gulp.task('vendor', function () {
  gulp.src([
    nodePath + '/jquery/dist/jquery.min.js',
    assetsPath + '/js/vendor/twitter.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(publicPath + '/js'));
});

gulp.task('js-clean', function () {
  gulp.src([publicPath + '/js/*.js', '!' + publicPath + '/js/vendor.js'], {read: false})
    .pipe(clean());
});

gulp.task('watch', function () {
  watch(assetsPath + '/js/*.js', function () {
    gulp.start(['webpack']);
  });

  watch(assetsPath + '/sass/*.sass', function () {
    gulp.start(['sass']);
  });

  watch(assetsPath + '/images/*', function () {
    gulp.start(['copy-images']);
  });
});