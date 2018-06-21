var app = angular.module('documentManagerApp', ['ngRoute']);

app.config(function($routeProvider) {

	$routeProvider.when('/:gid', {
		template: '<documentdetails></documentdetails>'
	});

	$routeProvider.when('/document/:uid', {
		redirectTo: function(parameters) {
			return '/' + t('documents', 'All documents') + '/' + parameters.uid;
		}
	});

	$routeProvider.when('/:gid/:uid', {
		template: '<documentdetails></documentdetails>'
	});

	$routeProvider.otherwise('/' + t('documents', 'All documents'));

});

app.config(['$httpProvider', function($httpProvider) {
	/* eslint-disable camelcase*/
	$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;
	/* eslint-enable camelcase*/
}]);