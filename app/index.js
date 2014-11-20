'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  constructor: function (options) {
    yeoman.generators.Base.apply(this, arguments);
    
    this.option('test');
    // require package.json
    this.pkg = require('../package.json');
  },
  
  promptTask: function () {
    var done = this.async();
    
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')('Yo CleanSlate,         Make me a theme!'));
      this.log(chalk.magenta(
        'Out of the box I include the wvu-starter-kit and the directory ' +
        'structure you need to start coding your theme.'
      ));
    }
    
    var prompts = [{
      type: 'input',
      name: 'theme_name',
      message: 'What would you like to name your theme?',
      validate: function(input){
        if (input == _s.slugify(input) && input !== 'cleanslate-themes') return true;
        if (input == 'cleanslate-themes'){
          return chalk.red(
            'Warning: You might be trying to install a theme in the /cleanslate_theme/ root directory.'
          );
        }
        return "You need to provide a valid theme name";
      },
      default: _s.slugify(this.appname) // Defaults to the project folder
    }, {
      type: 'input',
      name: 'theme_description',
      message: 'In a few words describe your theme?',
      default : _s.slugify(this.appname) + ' CleanSlate Theme'
    }, {
      type: 'input',
      name: 'theme_version',
      message: 'Set theme version',
      default : '1.0.0'
    }, {
      type: 'input',
      name: 'theme_domain',
      message: 'What will be the theme\'s domain name?',
      default: _s.slugify(this.appname) + '.wvu.edu'
    }, {
      type: 'input',
      name: 'theme_repository',
      message: 'What is the theme\'s git repository url?',
      default: 'http://stash.development.wvu.edu/scm/cst/'+_s.slugify(this.appname)+'.git'
    }, {
      type: 'input',
      name: 'author_name',
      message: 'What is your full name?',
      validate: function(input){
        if (input.length !== 0) return true;
        return "You need to provide a valid full name";
      }
    }, {
      type: 'input',
      name: 'author_email',
      message: 'What is your WVU email?',
      validate: function(input){
        if (/\S+@mail.wvu.edu/.test(input)) return true;
        return "You need to provide a valid WVU email address 'user.name@mail.wvu.edu'"
      }
    }, {
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'HTML5-Shiv',
        value: 'includeHTML5Shiv',
        checked: true
      },{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: false
      },{
        name: 'RespondJS',
        value: 'includeRespondJS',
        checked: true
      },{
        name: 'jQuery',
        value: 'includeJquery',
        checked: false
      }]
    }, {
      when: function (answer) {
        return answer && answer.features && answer.features.indexOf('includeJquery') !== -1;
      },
      type: 'list',
      name: 'jqueryVersion',
      message: 'Which Version of jQuery?',
      choices: [
        {
          value: '1.11.1',
          name: '1.11.1 - Supports old Internet Explorer'
        },
        {
          value: '2.1.1',
          name: '2.1.1 - No support for old IE, lighter weight package.'
        }
      ],
      default: 0
    }, {
      type: 'list',
      name: 'gulp',
      message: 'Do you plan on using Gulp?',
      choices: [
        {
          value: false,
          name: 'No'
        },
        {
          value: true,
          name: 'Yes'
        }
      ],
      default: 1
    }, {
      when: function (answer) {
        return answer.gulp === true;
      },
      type: 'list',
      name: 'reload',
      message: 'Preinstall BrowserSync or LiveReload?',
      choices: [
        {
          value: 'browsersync',
          name: 'BrowserSync'
        },
        {
          value: 'livereload',
          name: 'LiveReload'
        },
        {
          value: 'none',
          name: 'Neither'
        }
      ],
      default: 0
    }, {
      type: 'confirm',
      name: 'ready_set_go',
      value: 'ready',
      message: chalk.green('I am now going to install some files, be patient. \n') +
        chalk.red('Press return when you are ready'),
      default: true
    }];


    if (this.options.test == true) {
      this.prompt([], function(){
        this.themeName = "test";
        this.themeDescription = "test theme";
        this.themeVersion = "0.0.1";
        this.themeDomain = "test.wvu.edu";
        this.themeGitRepo = "http://stash.development.wvu.edu/scm/cst/test.git";
        this.authorName = "test";
        this.authorEmail = "test@mail.wvu.edu";
        this.jquery = true;
        this.jqueryVersion = "1.11.1";
        this.modernizr = true;
        this.html5shiv = true;
        this.respondjs = true;
        this.gulp = true;
        this.reload = "browsersync";
        this.autoopen = true;
        done();
      }.bind(this));
    } else {
      this.prompt(prompts, function(answers){

        var features = answers.features;

        function hasFeature(feat) {
          return features && features.indexOf(feat) !== -1;
        }

        this.themeName = answers.theme_name;
        this.themeDescription = answers.theme_description;
        this.themeVersion = answers.theme_version;
        this.themeDomain = answers.theme_domain;
        this.themeGitRepo = answers.theme_repository;
        this.authorName = answers.author_name;
        this.authorEmail = answers.author_email;
        this.jquery = hasFeature('includeJquery');
        this.jqueryVersion = answers.jqueryVersion;
        this.modernizr = hasFeature('includeModernizr');
        this.html5shiv = hasFeature('includeHTML5Shiv');
        this.respondjs = hasFeature('includeRespondJS');
        this.gulp = answers.gulp;
        if (answers.gulp === true) {
          this.reload = answers.reload;
        } else {
          this.reload = 'none';
        }
        if (this.reload == 'BrowserSync') {
          this.autoopen = answers.autoopen;
        }

        done();
      }.bind(this)); 
    }
  },
  
  git: function() {
    var done = this.async();
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes','.gitattributes');
    done();
  },
  
  gulp: function(){
    var done = this.async();
    this.copy('_gulpfile.js','gulpfile.js');
    done();
  },
  
  npm: function(){
    var done = this.async();
    this.template('_package.json','package.json');
    done();
  },
  
  bower: function(){
    var done = this.async();
    this.template('_bower.json','bower.json');
    done();
  },

  theme_readme: function(){
    var done = this.async();
    this.template('_README.md','README.md');
    done();
  },
  
  theme_config: function(){
    var done = this.async();
    this.template('_config.yml','config.yml');
    this.template('_mock_data.yml','mock_data.yml');
    done();
  },
  
  theme_directories: function(){
    var done = this.async();
    this.mkdir('javascripts');
    this.mkdir('stylesheets');
    this.mkdir('scss');
    this.mkdir('views');
    this.mkdir('views/layouts');
    done();
  },

  theme_files: function(){
    var done = this.async();
    this.copy('_styles.scss','scss/styles.scss');
    this.template('_default.html','views/layouts/default.html');
    this.copy('_frontpage.html','views/frontpage.html');
    done();
  },
  
  
  install: function () {
    this.on('end', function () {

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install'],
          callback: function () {
            this.spawnCommand('gulp', ['cleanslate:copy:views','cleanslate:beautify:views','cleanslate:beautify:gulpfile','sass']);
          }.bind(this) // bind the callback to the parent scope
        });
      }
    });
  }
});