angular.module('documentManagerApp')
	.directive('organisationlist', function() {
		return {
			restrict: 'EA', // has to be an attribute to work with core css
			scope: {},
			controller: 'organisationlistCtrl',
			controllerAs: 'ctrl',
			bindToController: {},
			templateUrl: OC.linkTo('documentmanager', 'templates/fragments/organisationList.html')
		};
	});