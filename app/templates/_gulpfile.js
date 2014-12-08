'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    <% if (reload == 'browsersync') { %>browserSync = require('browser-sync'),<% } %><% if (reload == 'livereload') { %>livereload = require('gulp-livereload'),<% } %>
    prefix = require('gulp-autoprefixer'),
    beautify = require('gulp-js-beaut'),
    frontMatter = require('gulp-front-matter'),
    tap = require('gulp-tap'),
    YAML = require('yamljs');

<% if (reload == 'browsersync') { %>
// BrowserSync Loading Task
gulp.task('browser-sync', function() {
  browserSync({
    logConnections: true,
    logSnippet: false
  });
});
<% } %>

<% if (reload == 'livereload') { %>
// LiveReload Loading Task
gulp.task('livereload', function(){
  livereload.listen({auto: true});
})
<% } %>

// CleanSlate - Copy Views from bower_components to views/
gulp.task('cleanslate:copy:views', function(){
  gulp.src([
    './bower_components/wvu-patterns-masthead/src/cleanslate/_wvu-masthead.html',
    './bower_components/wvu-patterns-masthead-logo/src/cleanslate/_wvu-masthead__logo.html',
    './bower_components/wvu-patterns-masthead-links/src/cleanslate/_wvu-masthead__links.html',
    './bower_components/wvu-patterns-footer/src/cleanslate/_wvu-footer.html',
    './bower_components/wvu-patterns-footer-credits/src/cleanslate/_wvu-footer__credits.html',
    './bower_components/wvu-patterns-footer-links/src/cleanslate/_wvu-footer__links.html',
  ])
  .pipe(gulp.dest('./views/layouts/'));
});

// CleanSlate - Beautify View files
// For more information: https://github.com/zeroedin/gulp-js-beaut
gulp.task('cleanslate:beautify:views', function() {
  var config = {
    html: {
      indent_inner_html: true,
      indent_size: 2,
      indent_char: " ",
      brace_style: "collapse",
      indent_scripts: "normal",
      wrap_line_length: 500,
      preserve_newlines: true,
      max_preserve_newlines: 1,
      end_with_newline: true
    }
  };
  gulp.src([
      './views/**/*.html'
    ], {
      base: './'
    }).pipe(frontMatter({
      property: 'frontMatter',
      remove: true
    }))
    .pipe(beautify(config))
    .pipe(tap(function(file, t){
      if (Object.keys(file['frontMatter']).length > 0){
        var yaml = YAML.stringify(file['frontMatter'], 2)
        var fm = [
          '---',
          yaml,
          '---',
          '',
          ''
        ].join('\n');
        file.contents = Buffer.concat([
          new Buffer(fm), file.contents
        ]);
      }
    }))
    .pipe(gulp.dest('./'));
});

// CleanSlate - Beautify Gulpfile.js
// For more information: https://github.com/zeroedin/gulp-js-beaut
gulp.task('cleanslate:beautify:gulpfile', function(){
  var config = {
    js: {
      indent_size: 2,
      indent_char: " ",
      indent_level: 0,
      indent_with_tabs: false,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      jslint_happy: false,
      space_after_anon_function: false,
      brace_style: "collapse",
      keep_array_indentation: false,
      keep_function_indentation: false,
      space_before_conditional: true,
      break_chained_methods: false,
      eval_code: false,
      unescape_strings: false,
      wrap_line_length: 0
    }
  };

  gulp.src([
    './gulpfile.js'
  ], {base: './'})
  .pipe(beautify(config))
  .pipe(gulp.dest('./'));
});

// Sass Task - Uses Gulp Sass
// For more information https://github.com/dlmanning/gulp-sass
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
    .pipe(gulp.dest('./stylesheets/'))
    <% if (reload == "browsersync") { %>.pipe(browserSync.reload({stream:true}));<% } %><% if (reload == "livereload") { %>.pipe(livereload({auto: false}));<% } %>
});

// Reload Task
gulp.task('reload', function () {
  gulp.src('views/**/*.html')
    <% if (reload == "browsersync") { %>.pipe(browserSync.reload({stream:true}));<% } %><% if (reload == "livereload") { %>.pipe(livereload({auto: false}));<% } %>
});

// Watch Task
gulp.task('watch', function () {
  <% if (reload == ('livereload' || 'browsersync')) { %>gulp.watch(['**/*.html','**/*.yml'],['reload']);<% } %>
  gulp.watch(['scss/*.scss','scss/**/*.scss'],['sass']);
  gulp.watch(['javascript/**/*.js'],['javascript']);
});

// Default Task
gulp.task('default', [
  <% if (reload == 'livereload') { %>'livereload',<% } %>
  'sass',
  'watch'
  <% if (reload == 'browsersync') { %>,'browser-sync'<% } %>
]);
