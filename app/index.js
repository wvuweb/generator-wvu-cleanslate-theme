'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function (options) {
    yeoman.generators.Base.apply(this, arguments);
    
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
      default : this.appname // Defaults to the project folder
    }, {
      type: 'input',
      name: 'theme_description',
      message: 'In a few words describe your theme?',
      default : this.appname + ' Clean Slate Theme'
    }, {
      type: 'input',
      name: 'theme_version',
      message: 'Set theme version',
      default : '1.0.0'
    }, {
      type: 'input',
      name: 'theme_domain',
      message: 'What is the theme\'s domain name?',
      default: null
    }, {
      type: 'input',
      name: 'theme_repository',
      message: 'What is the theme\'s git repository url?',
      default: null
    }, {
      type: 'input',
      name: 'author_name',
      message: 'What is your name?',
      default: null 
    }, {
      type: 'input',
      name: 'author_email',
      message: 'What is your email?',
      default: null
    }, {
      type: 'confirm',
      name: 'ready_set_go',
      value: 'ready',
      message: chalk.green('I am now going to install some files, be patient. \n') +
        chalk.red('Press return when you are ready'),
      default: true
    }];
    
    this.prompt(prompts, function(answers){
      this.themeName = answers.theme_name;
      this.themeDescription = answers.theme_description;
      this.themeVersion = answers.theme_version;
      this.themeDomain = answers.theme_domain;
      this.themeGitRepo = answers.theme_repository;
      this.authorName = answers.author_name;
      this.authorEmail = answers.author_email;
      
      done();
    }.bind(this));
  },
  
  git: function() {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes','.gitattributes');
  },
  
  gulp: function(){
    this.copy('_gulpfile.js','gulpfile.js');
  },
  
  npm: function(){
    this.template('_package.json','package.json');
  },
  
  bower: function(){
    this.template('_bower.json','bower.json');
  },

  theme_readme: function(){
    this.template('_README.md','README.md');
  },
  
  theme_config: function(){
    this.template('_config.yml','config.yml');
    this.template('_mock_data.yml','mock_data.yml');
  },
  
  theme_directories: function(){
    this.mkdir('javascripts');
    this.mkdir('stylesheets');
    this.mkdir('scss');
    this.mkdir('views');
    this.mkdir('views/layouts');
  },
  
  theme_files: function(){
    this.copy('_styles.scss','scss/styles.scss')
    this.copy('_default.html','views/layouts/default.html');
    this.copy('_frontpage.html','views/frontpage.html');
  },
  
  install: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install'],
          callback: function () {
            this.spawnCommand('gulp', ['cleanslate:copy:views','sass']);
          }.bind(this) // bind the callback to the parent scope
        });
      }
    });
  },
  

  
  
});