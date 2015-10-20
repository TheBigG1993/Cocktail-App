var gulp = require('gulp');

var browserSync = require('browser-sync').create();

var fileinclude = require('gulp-file-include');

// CSS Stuff
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');

// JS Stuff
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('root', function () {
  return gulp.src('./src/root/**')
  .pipe(gulp.dest('./build'));
});

gulp.task('html', function () {
  return gulp.src('./src/html/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './src/html'
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

gulp.task('css', function () {
  return gulp.src('./src/css/master.styl')
    .pipe(stylus({
        'include css': true,
    }))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return gulp.src('./src/js/**')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});

gulp.task('build', ['root', 'html', 'css', 'js']);

gulp.task('serve', ['build'], function () {

  browserSync.init({
    server: "./build"
  });

  gulp.watch(['./src/html/**'], ['html']);
  gulp.watch(['./src/css/**'], ['css']);
  gulp.watch(['./src/js/**'], ['js']);
});

gulp.task('default', ['build']);
