angular.module('documentManagerApp')
	.controller('organisationCtrl', function() {
		var ctrl = this;

		ctrl.getSelectedId = function() {
	        return 1;
	    };

		ctrl.id = function() {
			return ctrl.organisation.id();
		};

		ctrl.name = function() {
			return ctrl.organisation.name();
		};

		ctrl.email = function() {
			return ctrl.organisation.email();
		};

		ctrl.url = function() {
			return ctrl.organisation.url();
		};
	});