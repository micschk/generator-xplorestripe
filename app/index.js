'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var git = require('simple-git')();

var XploreStripeGenerator = yeoman.generators.Base.extend({
	init: function () {
        this.pkg = require('../package.json');

        this.on('end', function () {
            this.log(chalk.magenta('Be sure to run ') +
					 chalk.yellow('composer install') +
				     chalk.magenta(' from httpdocs/'));

            if (!this.options['skip-install']) {
                //this.installDependencies();
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
            message: 'What\'s your site name?'
        }, {
            name: 'ssVersion',
            message: 'What version of SilverStripe do you want to use?',
			default: '*'
        }, {
            type: 'confirm',
            name: 'useVagrant',
            message: 'Do you want to use Vagrant?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.siteName = props.siteName;
            this.ssVersion = props.ssVersion;
            this.useVagrant = props.useVagrant;

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

	app: function () {
		this.directory('httpdocs', 'httpdocs');

		this.mkdir('httpdocs/assets/Uploads');
		this.mkdir('httpdocs/themes');

		this.template('_composer.json', 'httpdocs/composer.json');
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
});

module.exports = XploreStripeGenerator;
