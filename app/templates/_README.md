<%= siteName %>
===============

What it does
------------

SilverStripe is installed via Composer to `httpdocs/`.

Custom configuration files are created which are added to `.gitignore`.

Configuration
-------------

The default SilverStripe config expects a `vagrant` database on `localhost`, username `vagrant`, password `vagrant`.<% if (useVagrant) { %>

The default SilverStripe admin account is `vagrant`, password `vagrant`.<% } %><% if (useVagrant) { %>

How to use
----------

Run `vagrant up` to run a local development machine, then browse to http://localhost:8080/dev/build to let SilverStripe run the initial build.

Now you can view the site at http://localhost:8080 and login at http://localhost:8080/admin.

If using an Xplore VagrantBox, phpMyAdmin is available at http://localhost:8080/phpmyadmin.

### Images

The `Page` class contains two methods for rendering images: `RenderRetinaImage` and `RenderBootstrapImage`.

Both require the **picturefill** javascript library to enable full support https://github.com/scottjehl/picturefill.

Both apply the class **img-responsive** and `item-prop="image"`.

The `$image` parameter for both methods can either be an `Image` instance, or an `int` representing the ImageID. If `$alt` is not provided the the image `Title` is applied.

#### RenderRetinaImage

`RenderRetinaImage($image, $width = null, $height = null, $alt = null)`

This renders an image at the given width and/or height, as well as double resolution image for high-DPI devices.

#### RenderBootstrapImage

`RenderBootstrapImage($image, $alt = null, $colXS = null, $colSM = null, $colMD = null, $colLG = null)`

Since all of Xplore's templates are based on [BootStripe](https://github.com/XploreNet/bootstripe), therefore [Bootstrap](http://getbootstrap.com/), we often need to render images to suit different columns.

By passing the number of columns the image must fill at each breakpoint, an `img` is generated with a `srcset` to suit each breakpoint, as well as a high-DPI version for each breakpoint. If a breakpoint column parameter is not passed then it defaults to the breakpoint below. If no breakpoint columns are passed they all default to `12` or full-width.

Customisation
-------------

Puppet installs a default SilverStripe database when provisioning. You can use a custom database by exporting it and overwriting `puppet/modules/silverstripe/files/silverstripe-db.sql`.<% } %>
