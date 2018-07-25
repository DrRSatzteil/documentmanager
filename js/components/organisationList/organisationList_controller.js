angular.module('documentManagerApp')
	.controller('organisationlistCtrl', function(DocumentService) {
		var ctrl = this;
		ctrl.organisations = [];
		DocumentService.register(function(ev) {
		    if (ev.event === 'updatedOrganisation') {
				// TODO: Better only use the imported document from the event. org list is not yet updated
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
			if (ev.event === 'imported') {
				// TODO: We need to check if we have a non initialized document here to show in the dummy org
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
		});
		DocumentService.getAllOrganisations(ctrl.organisations);
	});