angular.module('documentManagerApp')
.controller('organisationCtrl', function() {
	var ctrl = this;

	ctrl.t = {
		errorMessage : t('contacts', 'This card is corrupted and has been fixed. Please check the data and trigger a save to make the changes permanent.'),
	};

	ctrl.getName = function() {
		return ctrl.contact.displayName();
	};
});

