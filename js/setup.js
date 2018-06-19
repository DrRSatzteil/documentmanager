

/**
 * Nextcloud - contacts
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Hendrik Leppelsack <hendrik@leppelsack.de>
 * @copyright Hendrik Leppelsack 2015
 */

/**angular.module('documentManagerApp', ['uuid4', 'angular-cache', 'ngRoute', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'angular-click-outside', 'ngclipboard'])*/
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
    $httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;
}]);
