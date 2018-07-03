var app = angular.module('documentManagerApp', ['ngRoute', 'angular-cache']);

app.config(function($routeProvider) {

	$routeProvider.when('/:gid', {
		template: '<documentdetails></documentdetails>'
	});

	$routeProvider.when('/document/:id', {
		redirectTo: function(parameters) {
			return '/' + t('documents', 'All documents') + '/' + parameters.uid;
		}
	});

	$routeProvider.when('/:gid/:id', {
		template: '<documentdetails></documentdetails>'
	});

	$routeProvider.otherwise('/' + t('documents', 'All documents'));

});

app.config(['$httpProvider', function($httpProvider) {
	/* eslint-disable camelcase*/
	$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;
	/* eslint-enable camelcase*/
}]);