'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer');


gulp.task('cleanslate:copy:views', function(){
  gulp.src([
    './bower_components/wvu-patterns-masthead/src/cleanslate_view/_wvu-masthead.html',
    './bower_components/wvu-patterns-masthead-logo/src/cleanslate_view/_wvu-masthead__logo.html',
    './bower_components/wvu-patterns-masthead-links/src/cleanslate_view/_wvu-masthead__links.html',
    './bower_components/wvu-patterns-footer/src/cleanslate_view/_wvu-footer.html',
    './bower_components/wvu-patterns-footer-credits/src/cleanslate_view/_wvu-footer__credits.html',
    './bower_components/wvu-patterns-footer-links/src/cleanslate_view/_wvu-footer__links.html',
  ])
  .pipe(gulp.dest('views/layouts/'));
});
    
gulp.task('sass', function() {
  gulp.src([
    'scss/*.scss',
    'scss/**/*.scss'
    ])
    .pipe(sass({
      includePaths: ['scss'], 
      sourcemap: true, 
      outputStyle: 'expanded'
    }))
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7", { cascade: true }))
    .pipe(gulp.dest('stylesheets/'));
});


gulp.task('default', ['sass']);