'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var git = require('simple-git')();
var fs = require('fs');

var XploreStripeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      this.log(
          chalk.magenta('Now run ') +
              chalk.yellow('vagrant up') +
              chalk.magenta(' then visit ') +
              chalk.yellow('http://localhost:8080/dev/build') +
              chalk.magenta(' to complete the SilverStripe installation')
      );
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic XploreStripe generator.'));

    var prompts = [{
        name: 'siteName',
        message: 'What\'s your site name?',
        default: 'My Site'
    }, {
        name: 'ssVersion',
        message: 'What version of SilverStripe do you want to use?',
        default: '3.1.3'
    }, {
        type: 'confirm',
        name: 'useVagrant',
        message: 'Do you want to use Vagrant?',
        default: true
    }, {
        type: 'confirm',
        name: 'customTheme',
        message: 'Do you want to install a custom theme?',
        default: true
    }];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.ssVersion = props.ssVersion;
      this.useVagrant = props.useVagrant;
      this.customTheme = props.customTheme;
      this.themeName = 'simple';

      done();
    }.bind(this));
  },

  askVagrant: function () {
    if (!this.useVagrant) {
      return;
    }

    var done = this.async();

    var prompts = [{
        name: 'vagrantBox',
        message: 'What Vagrant box would you like to use?',
        default: 'xplore/debian-6.0.9'
    }];

    this.prompt(prompts, function (props) {
      this.vagrantBox = props.vagrantBox;

      done();
    }.bind(this));
  },

  askTheme: function () {
    if (!this.customTheme) {
      return;
    }

    var done = this.async();

    var prompts = [{
        name: 'themeName',
        message: 'Name for your theme',
        default: this.siteName
    }, {
        name: 'themeUser',
        message: 'Theme GitHub user',
        default: 'xplorenet'
    }, {
        name: 'themeRepo',
        message: 'Theme GitHub repository',
        default: 'bootstripe'
    }]

    this.prompt(prompts, function (props) {
      this.themeName = this._.slugify(props.themeName);
      this.themeUser = props.themeUser;
      this.themeRepo = props.themeRepo;

      done();
    }.bind(this));
  },

  askPlugins: function () {
    var done = this.async();

    var prompts = [
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'We recommend the following SilverStripe plugins:',
        choices: [
          { name: 'UserForms', value: 'userForms', checked: true },
          { name: 'Google Sitemaps', value: 'googleSitemaps', checked: true }
        ]
      }
    ];

    this.prompt(prompts, function (props) {
      var plugins = props.plugins;

      function hasPlugin(plugin) {
        return plugins.indexOf(plugin) !== -1;
      }

      this.includeUserForms = hasPlugin('userForms');
      this.includeSitemaps = hasPlugin('googleSitemaps');

      done();
    }.bind(this));
  },

  app: function () {
    this.directory('httpdocs', 'httpdocs');

    this.mkdir('httpdocs/assets/Uploads');
    this.mkdir('httpdocs/mysite/_config');
    this.mkdir('httpdocs/themes');

    this.template('_composer.json', 'httpdocs/composer.json');
    this.template('_config.yml', 'httpdocs/mysite/_config/config.yml');
  },

  projectFiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');

    this.template('_gitignore', '.gitignore');
    this.template('_README.md', 'README.md');
  },

  vagrantFiles: function () {
    if (!this.useVagrant) {
      return;
    }

    this.template('_Vagrantfile', 'Vagrantfile');
    this.directory('puppet', 'puppet');
  },

  themeFiles: function () {
    if (!this.customTheme) {
      return;
    }

    var done = this.async(),
        me = this,
        dest = 'httpdocs/themes/' + this.themeName;

    me.log(chalk.magenta('Cloning theme repository'));
    this.remote(this.themeUser, this.themeRepo, function (err, remote) {
      if (err) {
        me.log(chalk.red(err));
        return done();
      }

      remote.directory('.', dest);

      done();
    });
  },

  themeDependencies: function () {
    if (!this.customTheme) {
      return;
    }

    var done = this.async(),
        baseDir = process.cwd(),
        themeDir = baseDir + '/httpdocs/themes/' + this.themeName + '/',
        waitBower = false,
        waitNpm = false;

    this.log(chalk.magenta('Installing theme dependencies'));

    // Theme bower install
    if (fs.existsSync(themeDir + 'bower.json')) {
      waitBower = true;
      process.chdir(themeDir);
      this.runInstall('bower', null, null, function () {
        waitBower = false;
        cb();
      });
    }

    // Theme node install
    if (fs.existsSync(themeDir + 'package.json')) {
      waitNpm = true;
      process.chdir(themeDir);
      this.runInstall('npm', null, null, function () {
        waitNpm = false;
        cb();
      });
    }

    var cb = function () {
      if (waitNpm) return;
      if (waitBower) return;

      process.chdir(baseDir);
      done();
    }
  },

  themeBuild: function () {
    if (!this.customTheme) {
      return;
    }

    this.log(chalk.magenta('Building the theme'));

    var done = this.async(),
        me = this,
        baseDir = process.cwd(),
        themeDir = baseDir + '/httpdocs/themes/' + this.themeName + '/';

    var cb = function (err) {
      process.chdir(baseDir);

      if (err) {
        me.log(chalk.red(err));
      }

      done();
    };

    // Grunt
    if (fs.existsSync(themeDir + 'Gruntfile.js')) {
      process.chdir(themeDir);
      this.emit('gruntInstall');
      this.spawnCommand('grunt', ['build'], cb)
          .on('error', cb)
          .on('exit', this.emit.bind(this, 'gruntInstall:end'))
          .on('exit', function (err) {
            cb(err);
          }.bind(this));
    }
  },

  composerInstal: function () {
    if (this.options['skip-install']) {
      return;
    }

    var done = this.async(),
        baseDir = process.cwd();

    this.log(chalk.magenta('Installing composer dependencies'));

    process.chdir(baseDir + '/httpdocs');
    this.runInstall('composer', null, null, function () {
      process.chdir(baseDir);
      done();
    });
  }
});

module.exports = XploreStripeGenerator;
