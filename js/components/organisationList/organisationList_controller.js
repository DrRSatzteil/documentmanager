angular.module('documentManagerApp')
	.controller('organisationlistCtrl', function(DocumentService) {
		var ctrl = this;
		ctrl.organisations = [];
		DocumentService.register(function(ev) {
		    if (ev.event === 'imported') {
				// TODO: Better only get the imported documents from the event. org list is not yet updated
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
			if (ev.event === 'imported') {
				// TODO: Better only get the imported documents from the event. org list is not yet updated
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
		});
		DocumentService.getAllOrganisations(ctrl.organisations);
	});