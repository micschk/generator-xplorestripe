# XploreStripe

A Yeoman generator for [SilverStripe](http://www.silverstripe.org/), designed to work with [Xplore's](http://www.xplore.net/) [Vagrant Boxes](https://vagrantcloud.com/xplore/).

## What it does

SilverStripe is deployed via Composer to `httpdocs/`.  You can specify which version to install also.

Custom configuration files are created which are added to `.gitignore`.

You can optionally choose to create a [Vagrant](http://www.vagrantup.com/) config, defaulting to Xplore's [Debian 6.0.9 development box](https://vagrantcloud.com/xplore/debian-6.0.9).

## Configuration

The default SilverStripe config expects a `vagrant` database on `localhost`, username `vagrant`, password `vagrant`.

The default SilverStripe admin account is `vagrant`, password `vagrant`.

## Customisation

If you choose to use Vagrant, [Puppet](http://puppetlabs.com/) will install a default SilverStripe database during provisioning.

You can use a custom database by exporting it and overwriting `puppet/modules/silverstripe/files/silverstripe-db.sql`.

## License

MIT
