angular.module('documentManagerApp')
	.filter('newOrganisation', function() {
		return function(input) {
			return input !== '' ? input : t('documentmanager', 'New organisation');
		};
	});