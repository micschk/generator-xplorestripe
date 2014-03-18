<?php

	global $project;
	$project = 'mysite';

	global $databaseConfig;
	$databaseConfig = array(
		"type"     => 'MySQLDatabase',
		"server"   => 'localhost',
		"username" => 'vagrant',
		"password" => 'vagrant',
		"database" => 'vagrant',
		"path"     => '',
	);

	// Set the site locale
	i18n::set_locale('en_US');

	// Fulltext Search
	FulltextSearchable::enable();
