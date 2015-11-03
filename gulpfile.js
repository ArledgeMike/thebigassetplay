var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var minify_css = require('gulp-minify-css');
var minify_html = require('gulp-minify-html');
var order = require("gulp-order");


var del = require('del');

var paths = {
  scripts: 'js/*',
  images: 'images/*',
  css: 'css/*',
  sounds:'sound/*',
  fonts:'fonts/*'
};

gulp.task('clean', function() {

  return del(['build']);

});

gulp.task('scripts', ['clean'], function() {

  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(order([
    "jquery-2.1.4.min.js",
    "fastclick.js",
      "effects_engine.js",
 
    "asset_board.js",
    "asset_tile.js",
    "game_menus.js",
    "game_timer.js",
    "start_timer.js",
    "assets_counter.js",
    "power_meter.js",
       "index.js"
  ]))
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));

});

gulp.task('images', ['clean'], function() {
  
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 15}))
    .pipe(gulp.dest('build/images'));

});

gulp.task('html', ['clean'], function(){
	
	return gulp.src("index.html")
	  .pipe(minify_html())
	  .pipe(gulp.dest('build'));
	
	
});

gulp.task('sounds', ['clean'], function(){
	
	return gulp.src(paths.sounds)
	  .pipe(gulp.dest('build/sound'));
	
});

gulp.task('fonts', ['clean'], function(){
	
	return gulp.src(paths.fonts)
	  .pipe(gulp.dest('build/fonts'));
	
});


gulp.task('css', ['clean'], function(){
	
	return gulp.src(paths.css)
	  .pipe(minify_css())
    .pipe(concat('all.min.css'))
	  .pipe(gulp.dest('build/css'));
	
	
});



gulp.task('default', [ 'scripts', 'images', 'css', 'html', 'fonts', 'sounds']);