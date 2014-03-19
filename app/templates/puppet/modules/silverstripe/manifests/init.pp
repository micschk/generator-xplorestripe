# Configure SilverStripe

class silverstripe::install {

	# import database for basic silverstripe site
	file { '/tmp/db.sql':
		source => 'puppet:///modules/silverstripe/silverstripe-db.sql'
	}

	exec { 'load-db':
		command => '/usr/bin/mysql -u vagrant -pvagrant vagrant < /tmp/db.sql'
	}
}
