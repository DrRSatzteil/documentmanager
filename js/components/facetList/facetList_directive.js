angular.module('documentManagerApp')
.directive('facetlist', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'facetlistCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('documentmanager', 'templates/navigation/facetList.html')
	};
});
