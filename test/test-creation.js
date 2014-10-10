/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('wvu-cleanslate-theme generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }
      this.app = helpers.createGenerator('wvu-cleanslate-theme:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'bower.json',
      'package.json',
      'config.yml',
      'mock_data.yml',
      'gulpfile.js',
      '.gitignore',
      '.gitattributes',
      'README.md',
      'views/layouts/default.html',
      'views/frontpage.html'
    ];

    helpers.mockPrompt(this.app, {
      'someOption': 'Y'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});