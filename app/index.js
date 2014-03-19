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
            this.log(chalk.magenta('Installing dependencies'));

            if (!this.options['skip-install']) {
				var baseDir = process.cwd(),
					themeDir = baseDir + '/httpdocs/themes/' + this.themeName + '/';

				// Run composer
				process.chdir(baseDir + '/httpdocs');
				this.runInstall('composer');

				// Theme bower install
				if (fs.existsSync(themeDir + 'bower.json')) {
					process.chdir(themeDir);
					this.runInstall('bower');
				}

				// Theme node install
				if (fs.existsSync(themeDir + 'package.json')) {
					process.chdir(themeDir);
					this.runInstall('npm');
				}
            }
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
	}
});

module.exports = XploreStripeGenerator;
