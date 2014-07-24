<?php

  /**
   * Custom page which displays a list of child pages
   *
   * This page type is not intended to be used on it's own, but instead duplicated with NestedPage
   * and extended as a custom class as required specifically for the site, e.g. as a staff
   * directory.
   */
  class NestedHolder extends Page {

    #region Declarations

    /**
     * Array of possible child page types
     *
     * Comment out to allow all page types.
     *
     * @var array
     */
    static $allowed_children = array('NestedPage');

    /**
     * Page type description which appears in the CMS
     * @var string
     */
    static $description = 'Displays a list of child pages';

    /**
     * Icon which will appear in the CMS
     *
     * This is an absolute path which will be served as an HTTP request, e.g.
     * mysite/images/icon.png
     *
     * @var string
     */
    static $icon = null;

    #endregion Declarations

  }

  /**
   * Nested Holder controller
   */
  class NestedHolder_Controller extends Page_Controller {

  }
