angular.module('documentManagerApp')
.directive('loaddocumentsbutton', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'loadDocumentsButtonCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('documentmanager', 'templates/navigation/loadDocumentsButton.html')
	};
});
