# <%= siteName %>

## What it does

SilverStripe is installed via Composer to `httpdocs/`.

Custom configuration files are created which are added to `.gitignore`.

## Configuration

The default SilverStripe config expects a `vagrant` database on `localhost`, username `vagrant`, password `vagrant`.<% if (useVagrant) { %>

The default SilverStripe admin account is `vagrant`, password `vagrant`.<% } %><% if (useVagrant) { %>

## How to use

Run `vagrant up` to run a local development machine, then browse to http://localhost:8080/dev/build to let SilverStripe run the initial build.

Now you can view the site at http://localhost:8080 and login at http://localhost:8080/admin.

If using an Xplore VagrantBox, phpMyAdmin is available at http://localhost:8080/phpmyadmin.

## Customisation

Puppet installs a default SilverStripe database when provisioning. You can use a custom database by exporting it and overwriting `puppet/modules/silverstripe/files/silverstripe-db.sql`.<% } %>
