'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    <% if (reload == 'browsersync') { %>browserSync = require('browser-sync'),<% } %>
    <% if (reload == 'livereload') { %>livereload = require('gulp-livereload'),<% } %>
    prefix = require('gulp-autoprefixer');

<% if (reload == 'browsersync') { %>
gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: {
      host: "localhost",
      port: 2000
    }
  });
});
<% } %>

<% if (reload == 'livereload') { %>
gulp.task('livereload', function(){
  livereload.listen({auto: true});
})
<% } %>

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
    .pipe(gulp.dest('stylesheets/'))
    <% if (reload == "browsersync") { %>.pipe(browserSync.reload({stream:true}));<% } %>
    <% if (reload == "livereload") { %>.pipe(livereload({auto: false}));<% } %>
});

gulp.task('watch', function () {
  gulp.watch(['**/*.html','**/*.yml'],['reload']);
  gulp.watch(['scss/*.scss','scss/**/*.scss'],['sass']);
  gulp.watch(['javascript/**/*.js'],['javascript']);
});

gulp.task('default', [
  <% if (reload == 'livereload') { %>'livereload',<% } %>
  'sass',
  'watch'
  <% if (reload == 'browsersync') { %>,'browser-sync'<% } %>
]);