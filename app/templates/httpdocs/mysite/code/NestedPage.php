<?php

  /**
   * Custom page which is a child of NestedHolder
   *
   * This page type is not intended to be used on it's own, but instead duplicated with NestedHolder
   * and extended as a custom class as required specifically for the site, e.g. as a staff
   * directory.
   */
  class NestedPage extends Page {

    #region Declarations

    /**
     * Array of possible child page types
     *
     * Comment out to allow all page types.
     *
     * @var array
     */
    static $allowed_children = array();

    /**
     * Prevent the page from being added at the root level of the site tree
     * @var bool
     */
    static $can_be_root = false;

    /**
     * Additional database fields for the page type
     * @var array
     */
    static $db = array(
      'AdditionalText' => 'Varchar(255)'
    );

    /**
     * Default parent page type when adding the page
     * @var string
     */
    static $default_parent = 'NestedHolder';

    /**
     * Page type description which appears in the CMS
     * @var string
     */
    static $description = 'Individual page which displays under Nested Holder';

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

    #region Relationships

    /**
     * One to one relationships
     * @var array
     */
    static $has_one = array(
      'Image' => 'Image'
    );

    /**
     * One to many relationships
     * @var array
     */
    static $has_many = array();

    #endregion Relationships

    #region Public Methods

    /**
     * Modifies the CMS fields for the page to include the additional fields
     *
     * @return FieldList
     */
    public function getCMSFields() {
      // Retrieve the default fields from the parent page type
      $fields = parent::getCMSFields();

      // Define additional fields
      $additionalTextField = TextField::create('AdditionalText', 'Additional Text')
          ->setDescription('Additional text which appears on the page');
      $imageField = UploadField::create('Image', 'Image')
          ->setDescription('Must be at least 2,048px wide');

      // Add the fields to the CMS tabs
      $fields->addFieldToTab('Root.Main', $additionalTextField, 'Content');
      $fields->addFieldToTab('Root.Main', $imageField, 'Content');

      // Return the fields
      return $fields;
    }

    /**
     * Modifies the validation of the page to include the additional fields
     *
     * @returns RequiredFields
     */
    public function getCMSValidator() {
      // Retrieve the default validator from the parent page type
      $validator = parent::getCMSValidator();

      // Add the additional fields
      $validator->addRequiredField('AdditionalText');
      $validator->addRequiredField('Image');

      // Return the validator
      return $validator;
    }

    #endregion Public Methods

  }

  /**
   * Nested Page controller
   */
  class NestedPage_Controller extends Page_Controller {

  }
