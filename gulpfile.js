var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var minify_css = require('gulp-minify-css');
var del = require('del');

var paths = {
  scripts: 'js/*',
  images: 'images/*',
  css: 'css/*'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {

  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 15}))
    .pipe(gulp.dest('build/img'));
});

gulp.task('css', ['clean'], function(){
	
	return gulp.src(paths.css)
	.pipe(minify_css())
	.pipe(gulp.dest('build/css'));
	
	
});



// The default task (called when you run `gulp` from cli)
gulp.task('default', [ 'scripts', 'images', 'css']);