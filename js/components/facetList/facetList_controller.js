angular.module('documentManagerApp')
	.controller('facetlistCtrl', function(DocumentService) {
		var ctrl = this;
		ctrl.facets = [];
		/**DocumentService.getAll(ctrl.facets);
		DocumentService.register(function(ev) {
		    if (ev.event === 'imported') {
		        ctrl.facets.push(...ev.documents.data);
			}
		});**/
	});