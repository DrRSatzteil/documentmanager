angular.module('documentManagerApp')
	.controller('organisationlistCtrl', function(DocumentService) {
		var ctrl = this;
		ctrl.organisations = [];
		DocumentService.getAllOrganisations(ctrl.organisations);
	});