angular.module('documentManagerApp')
.directive('organisation', function() {
	return {
		scope: {},
		controller: 'organisationCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			organisation: '=data'
		},
		templateUrl: OC.linkTo('documentmanager', 'templates/organisationlist/organisation.html')
	};
});
