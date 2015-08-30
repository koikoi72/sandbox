var resolve = require('path').relative,
  gulp = require('gulp'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  uglifyjs = require('gulp-uglify'),
  uglifycss = require('gulp-uglifycss'),
  symlink = require('gulp-sym');

var appPath = resolve('.', './app'),
  publicPath = resolve('.', './app/public'),
  assetsPath = resolve('.', './app/assets'),
  nodePath = resolve('.', './node_modules');

gulp.task('default', ['jade', 'make-sym', 'copy-images', 'sass']);

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
  gulp.src(assetsPath + '/js/')
    .pipe(symlink(publicPath + '/js', {force: true}));
});

gulp.task('copy-images', function () {
  gulp.src(assetsPath + '/images/*')
    .pipe(gulp.dest(publicPath + '/images/'));
});

gulp.task('sass', function () {
  gulp.src(assetsPath + '/sass/*.sass')
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole:true
    }))
    .pipe(uglifycss())
    .pipe(gulp.dest(publicPath + '/css/'));
});

gulp.task('watch', function () {
  watch(assetsPath + '/jade/*.jade', function () {
    gulp.start(['jade']);
  });

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