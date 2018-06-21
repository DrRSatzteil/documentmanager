

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

app.config(['$routeProvider', function($routeProvider) {

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

}]);


app.config(['$httpProvider', function($httpProvider) {
	/* eslint-disable camelcase*/
	$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;
	/* eslint-enable camelcase*/
}]);
angular.module('documentManagerApp')
	.controller('facetlistCtrl', ['DocumentService', function(DocumentService) {
		var ctrl = this;
		ctrl.facets = [];
		DocumentService.getAll(ctrl.facets);
		DocumentService.register(function(ev) {
		    if (ev.event === 'imported') {
		        ctrl.facets.push(...ev.documents.data);
			}
		});
	}]);
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
angular.module('documentManagerApp')
	.controller('loadDocumentsButtonCtrl', ['$http', 'DocumentService', function($http, DocumentService) {
		var ctrl = this;
		ctrl.t = {
			loadDocuments : t('documentmanager', 'Load document(s)')
		};
		ctrl.loadDocuments = function() {
			var title = t('documentmanager', 'Choose document to load into Document Manager');
			var mimetypes = ['httpd/unix-directory', 'application/pdf'];
		    OC.dialogs.filepicker(title, _.bind(this.onCloudFileSelected, this), false, mimetypes);
		};
		ctrl.onCloudFileSelected = function(path) {
			DocumentService.loadDocuments(path);
		};
	}]);
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
angular.module('documentManagerApp')
	.controller('organisationCtrl', function() {
		var ctrl = this;

		ctrl.getSelectedId = function() {
	        return 1;
	    };

		ctrl.id = function() {
			return ctrl.organisation.uniqueId;
		};

		ctrl.name = function() {
			return ctrl.organisation.name;
		};

		ctrl.email = function() {
			return ctrl.organisation.email;
		};

		ctrl.url = function() {
			return ctrl.organisation.url;
		};
	});
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
angular.module('documentManagerApp')
	.controller('organisationlistCtrl', ['DocumentService', function(DocumentService) {
		var ctrl = this;
		ctrl.organisations = [];
		DocumentService.getAllOrganisations(ctrl.organisations);
	}]);
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
angular.module('documentManagerApp')
	.factory('Organisation', function() {
		return function Organisation() {

			var uniqueId;

			var name;

			var email;

			var url;
		};
	});
/*globals OC angular*/
angular.module('documentManagerApp')
	.factory('DocumentService', ['$http', 'Organisation', function($http, Organisation) {

		var observerCallbacks = [];

		var notifyObservers = function(eventName, payload) {
			var ev = {
				event: eventName,
				documents: payload
			};
			angular.forEach(observerCallbacks, function(callback) {
				callback(ev);
			});
		};

		var loadAll = function() {
			return $http.get(OC.generateUrl('/apps/documentmanager/documents'));
		};

		var load = function(request) {
		    return $http.post(OC.generateUrl('/apps/documentmanager/load'), JSON.stringify(request));
		};

		return {
			getAll: function(data) {
				loadAll().then(function(response) {
				    data.push(...response.data);
				});
			},
			getAllOrganisations: function(organisations) {
				loadAll().then(function(response) {
					for (var i = 0; i < response.data.length; i++) {
				        var organisation = new Organisation();
				        organisation.uniqueId = i;
				        organisation.name = response.data[i].organisation;
				        if (organisation.name === undefined) {
				            organisation.name = 'unknown';
				        }
						organisation.email = 'test@hp.com';
				        organisations.push(organisation);
					}
				});
			},
			loadDocuments: function(path) {
				var request = {
					path: path
				};
				load(request).then(function (response) {
					notifyObservers('imported', response);
				});
			},
			register: function(callback) {
				observerCallbacks.push(callback);
			}
		};
	}]);
angular.module('documentManagerApp')
	.filter('firstCharacter', function() {
		return function(input) {
			try {
				if (input === undefined || input === '') {
					return '0';
				}
				return input.charAt(0);
			}
			catch(err) {
				return '0';
			}
		};
	});
angular.module('documentManagerApp')
	.filter('newOrganisation', function() {
		return function(input) {
			return input !== '' ? input : t('documentmanager', 'New organisation');
		};
	});
angular.module('documentManagerApp')
	.filter('organisationColor', function() {
		return function(input) {
			var hash = md5(input).substring(0, 4),
				maxRange = parseInt('ffff', 16),
				hue = parseInt(hash, 16) / maxRange * 256;
			return 'hsl(' + hue + ', 90%, 65%)';
		};
	});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwiZmFjZXRMaXN0L2ZhY2V0TGlzdF9jb250cm9sbGVyLmpzIiwiZmFjZXRMaXN0L2ZhY2V0TGlzdF9kaXJlY3RpdmUuanMiLCJsb2FkRG9jdW1lbnRzQnV0dG9uL2xvYWREb2N1bWVudHNCdXR0b25fY29udHJvbGxlci5qcyIsImxvYWREb2N1bWVudHNCdXR0b24vbG9hZERvY3VtZW50c0J1dHRvbl9kaXJlY3RpdmUuanMiLCJvcmdhbmlzYXRpb24vb3JnYW5pc2F0aW9uX2NvbnRyb2xsZXIuanMiLCJvcmdhbmlzYXRpb24vb3JnYW5pc2F0aW9uX2RpcmVjdGl2ZS5qcyIsIm9yZ2FuaXNhdGlvbkxpc3Qvb3JnYW5pc2F0aW9uTGlzdF9jb250cm9sbGVyLmpzIiwib3JnYW5pc2F0aW9uTGlzdC9vcmdhbmlzYXRpb25MaXN0X2RpcmVjdGl2ZS5qcyIsIm9yZ2FuaXNhdGlvbl9tb2RlbC5qcyIsImRvY3VtZW50U2VydmljZS5qcyIsImZpcnN0Q2hhcmFjdGVyX2ZpbHRlci5qcyIsIm5ld09yZ2FuaXNhdGlvbl9maWx0ZXIuanMiLCJvcmdhbmlzYXRpb25Db2xvcl9maWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFJLE1BQU0sUUFBUSxPQUFPLHNCQUFzQixDQUFDOztBQUVoRCxJQUFJLDBCQUFPLFNBQVMsZ0JBQWdCOztDQUVuQyxlQUFlLEtBQUssU0FBUztFQUM1QixVQUFVOzs7Q0FHWCxlQUFlLEtBQUssa0JBQWtCO0VBQ3JDLFlBQVksU0FBUyxZQUFZO0dBQ2hDLE9BQU8sTUFBTSxFQUFFLGFBQWEsbUJBQW1CLE1BQU0sV0FBVzs7OztDQUlsRSxlQUFlLEtBQUssY0FBYztFQUNqQyxVQUFVOzs7Q0FHWCxlQUFlLFVBQVUsTUFBTSxFQUFFLGFBQWE7Ozs7O0FBSy9DLElBQUksT0FBTyxDQUFDLGlCQUFpQixTQUFTLGVBQWU7O0NBRXBELGNBQWMsU0FBUyxRQUFRLE9BQU8sZUFBZTs7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LFdBQVc7R0FDdkMsT0FBTyxTQUFTLE1BQU07O0lBRXJCIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuLyoqXHJcbiAqIE5leHRjbG91ZCAtIGNvbnRhY3RzXHJcbiAqXHJcbiAqIFRoaXMgZmlsZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIG9yXHJcbiAqIGxhdGVyLiBTZWUgdGhlIENPUFlJTkcgZmlsZS5cclxuICpcclxuICogQGF1dGhvciBIZW5kcmlrIExlcHBlbHNhY2sgPGhlbmRyaWtAbGVwcGVsc2Fjay5kZT5cclxuICogQGNvcHlyaWdodCBIZW5kcmlrIExlcHBlbHNhY2sgMjAxNVxyXG4gKi9cclxuXHJcbi8qKmFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnLCBbJ3V1aWQ0JywgJ2FuZ3VsYXItY2FjaGUnLCAnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAndWkuc2VsZWN0JywgJ25nU2FuaXRpemUnLCAnYW5ndWxhci1jbGljay1vdXRzaWRlJywgJ25nY2xpcGJvYXJkJ10pKi9cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnLCBbJ25nUm91dGUnXSk7XHJcblxyXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblxyXG5cdCRyb3V0ZVByb3ZpZGVyLndoZW4oJy86Z2lkJywge1xyXG5cdFx0dGVtcGxhdGU6ICc8ZG9jdW1lbnRkZXRhaWxzPjwvZG9jdW1lbnRkZXRhaWxzPidcclxuXHR9KTtcclxuXHJcblx0JHJvdXRlUHJvdmlkZXIud2hlbignL2RvY3VtZW50Lzp1aWQnLCB7XHJcblx0XHRyZWRpcmVjdFRvOiBmdW5jdGlvbihwYXJhbWV0ZXJzKSB7XHJcblx0XHRcdHJldHVybiAnLycgKyB0KCdkb2N1bWVudHMnLCAnQWxsIGRvY3VtZW50cycpICsgJy8nICsgcGFyYW1ldGVycy51aWQ7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCRyb3V0ZVByb3ZpZGVyLndoZW4oJy86Z2lkLzp1aWQnLCB7XHJcblx0XHR0ZW1wbGF0ZTogJzxkb2N1bWVudGRldGFpbHM+PC9kb2N1bWVudGRldGFpbHM+J1xyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci5vdGhlcndpc2UoJy8nICsgdCgnZG9jdW1lbnRzJywgJ0FsbCBkb2N1bWVudHMnKSk7XHJcblxyXG59KTtcclxuXHJcblxyXG5hcHAuY29uZmlnKFsnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpIHtcclxuXHQvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UqL1xyXG5cdCRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb24ucmVxdWVzdHRva2VuID0gb2NfcmVxdWVzdHRva2VuO1xyXG5cdC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlKi9cclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuY29udHJvbGxlcignZmFjZXRsaXN0Q3RybCcsIGZ1bmN0aW9uKERvY3VtZW50U2VydmljZSkge1xuXHRcdHZhciBjdHJsID0gdGhpcztcblx0XHRjdHJsLmZhY2V0cyA9IFtdO1xuXHRcdERvY3VtZW50U2VydmljZS5nZXRBbGwoY3RybC5mYWNldHMpO1xuXHRcdERvY3VtZW50U2VydmljZS5yZWdpc3RlcihmdW5jdGlvbihldikge1xuXHRcdCAgICBpZiAoZXYuZXZlbnQgPT09ICdpbXBvcnRlZCcpIHtcblx0XHQgICAgICAgIGN0cmwuZmFjZXRzLnB1c2goLi4uZXYuZG9jdW1lbnRzLmRhdGEpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmRpcmVjdGl2ZSgnZmFjZXRsaXN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLCAvLyBoYXMgdG8gYmUgYW4gYXR0cmlidXRlIHRvIHdvcmsgd2l0aCBjb3JlIGNzc1xuXHRcdFx0c2NvcGU6IHt9LFxuXHRcdFx0Y29udHJvbGxlcjogJ2ZhY2V0bGlzdEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7fSxcblx0XHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2RvY3VtZW50bWFuYWdlcicsICd0ZW1wbGF0ZXMvbmF2aWdhdGlvbi9mYWNldExpc3QuaHRtbCcpXG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5jb250cm9sbGVyKCdsb2FkRG9jdW1lbnRzQnV0dG9uQ3RybCcsIGZ1bmN0aW9uKCRodHRwLCBEb2N1bWVudFNlcnZpY2UpIHtcblx0XHR2YXIgY3RybCA9IHRoaXM7XG5cdFx0Y3RybC50ID0ge1xuXHRcdFx0bG9hZERvY3VtZW50cyA6IHQoJ2RvY3VtZW50bWFuYWdlcicsICdMb2FkIGRvY3VtZW50KHMpJylcblx0XHR9O1xuXHRcdGN0cmwubG9hZERvY3VtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRpdGxlID0gdCgnZG9jdW1lbnRtYW5hZ2VyJywgJ0Nob29zZSBkb2N1bWVudCB0byBsb2FkIGludG8gRG9jdW1lbnQgTWFuYWdlcicpO1xuXHRcdFx0dmFyIG1pbWV0eXBlcyA9IFsnaHR0cGQvdW5peC1kaXJlY3RvcnknLCAnYXBwbGljYXRpb24vcGRmJ107XG5cdFx0ICAgIE9DLmRpYWxvZ3MuZmlsZXBpY2tlcih0aXRsZSwgXy5iaW5kKHRoaXMub25DbG91ZEZpbGVTZWxlY3RlZCwgdGhpcyksIGZhbHNlLCBtaW1ldHlwZXMpO1xuXHRcdH07XG5cdFx0Y3RybC5vbkNsb3VkRmlsZVNlbGVjdGVkID0gZnVuY3Rpb24ocGF0aCkge1xuXHRcdFx0RG9jdW1lbnRTZXJ2aWNlLmxvYWREb2N1bWVudHMocGF0aCk7XG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5kaXJlY3RpdmUoJ2xvYWRkb2N1bWVudHNidXR0b24nLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnbG9hZERvY3VtZW50c0J1dHRvbkN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7fSxcblx0XHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2RvY3VtZW50bWFuYWdlcicsICd0ZW1wbGF0ZXMvbmF2aWdhdGlvbi9sb2FkRG9jdW1lbnRzQnV0dG9uLmh0bWwnKVxuXHRcdH07XG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuY29udHJvbGxlcignb3JnYW5pc2F0aW9uQ3RybCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdHJsID0gdGhpcztcblxuXHRcdGN0cmwuZ2V0U2VsZWN0ZWRJZCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHJldHVybiAxO1xuXHQgICAgfTtcblxuXHRcdGN0cmwuaWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjdHJsLm9yZ2FuaXNhdGlvbi51bmlxdWVJZDtcblx0XHR9O1xuXG5cdFx0Y3RybC5uYW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gY3RybC5vcmdhbmlzYXRpb24ubmFtZTtcblx0XHR9O1xuXG5cdFx0Y3RybC5lbWFpbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN0cmwub3JnYW5pc2F0aW9uLmVtYWlsO1xuXHRcdH07XG5cblx0XHRjdHJsLnVybCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN0cmwub3JnYW5pc2F0aW9uLnVybDtcblx0XHR9O1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmRpcmVjdGl2ZSgnb3JnYW5pc2F0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNjb3BlOiB7fSxcblx0XHRcdGNvbnRyb2xsZXI6ICdvcmdhbmlzYXRpb25DdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjoge1xuXHRcdFx0XHRvcmdhbmlzYXRpb246ICc9ZGF0YSdcblx0XHRcdH0sXG5cdFx0XHR0ZW1wbGF0ZVVybDogT0MubGlua1RvKCdkb2N1bWVudG1hbmFnZXInLCAndGVtcGxhdGVzL29yZ2FuaXNhdGlvbmxpc3Qvb3JnYW5pc2F0aW9uLmh0bWwnKVxuXHRcdH07XG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuY29udHJvbGxlcignb3JnYW5pc2F0aW9ubGlzdEN0cmwnLCBmdW5jdGlvbihEb2N1bWVudFNlcnZpY2UpIHtcblx0XHR2YXIgY3RybCA9IHRoaXM7XG5cdFx0Y3RybC5vcmdhbmlzYXRpb25zID0gW107XG5cdFx0RG9jdW1lbnRTZXJ2aWNlLmdldEFsbE9yZ2FuaXNhdGlvbnMoY3RybC5vcmdhbmlzYXRpb25zKTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5kaXJlY3RpdmUoJ29yZ2FuaXNhdGlvbmxpc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnb3JnYW5pc2F0aW9ubGlzdEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7fSxcblx0XHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2RvY3VtZW50bWFuYWdlcicsICd0ZW1wbGF0ZXMvZnJhZ21lbnRzL29yZ2FuaXNhdGlvbkxpc3QuaHRtbCcpXG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5mYWN0b3J5KCdPcmdhbmlzYXRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gT3JnYW5pc2F0aW9uKCkge1xuXG5cdFx0XHR2YXIgdW5pcXVlSWQ7XG5cblx0XHRcdHZhciBuYW1lO1xuXG5cdFx0XHR2YXIgZW1haWw7XG5cblx0XHRcdHZhciB1cmw7XG5cdFx0fTtcblx0fSk7IiwiLypnbG9iYWxzIE9DIGFuZ3VsYXIqL1xuYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXHJcblx0LmZhY3RvcnkoJ0RvY3VtZW50U2VydmljZScsIGZ1bmN0aW9uKCRodHRwLCBPcmdhbmlzYXRpb24pIHtcclxuXHJcblx0XHR2YXIgb2JzZXJ2ZXJDYWxsYmFja3MgPSBbXTtcclxuXHJcblx0XHR2YXIgbm90aWZ5T2JzZXJ2ZXJzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBwYXlsb2FkKSB7XHJcblx0XHRcdHZhciBldiA9IHtcclxuXHRcdFx0XHRldmVudDogZXZlbnROYW1lLFxyXG5cdFx0XHRcdGRvY3VtZW50czogcGF5bG9hZFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2gob2JzZXJ2ZXJDYWxsYmFja3MsIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXYpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWRBbGwgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChPQy5nZW5lcmF0ZVVybCgnL2FwcHMvZG9jdW1lbnRtYW5hZ2VyL2RvY3VtZW50cycpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGxvYWQgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcblx0XHQgICAgcmV0dXJuICRodHRwLnBvc3QoT0MuZ2VuZXJhdGVVcmwoJy9hcHBzL2RvY3VtZW50bWFuYWdlci9sb2FkJyksIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0bG9hZEFsbCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHQgICAgZGF0YS5wdXNoKC4uLnJlc3BvbnNlLmRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRBbGxPcmdhbmlzYXRpb25zOiBmdW5jdGlvbihvcmdhbmlzYXRpb25zKSB7XHJcblx0XHRcdFx0bG9hZEFsbCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdCAgICAgICAgdmFyIG9yZ2FuaXNhdGlvbiA9IG5ldyBPcmdhbmlzYXRpb24oKTtcclxuXHRcdFx0XHQgICAgICAgIG9yZ2FuaXNhdGlvbi51bmlxdWVJZCA9IGk7XHJcblx0XHRcdFx0ICAgICAgICBvcmdhbmlzYXRpb24ubmFtZSA9IHJlc3BvbnNlLmRhdGFbaV0ub3JnYW5pc2F0aW9uO1xyXG5cdFx0XHRcdCAgICAgICAgaWYgKG9yZ2FuaXNhdGlvbi5uYW1lID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHQgICAgICAgICAgICBvcmdhbmlzYXRpb24ubmFtZSA9ICd1bmtub3duJztcclxuXHRcdFx0XHQgICAgICAgIH1cclxuXHRcdFx0XHRcdFx0b3JnYW5pc2F0aW9uLmVtYWlsID0gJ3Rlc3RAaHAuY29tJztcclxuXHRcdFx0XHQgICAgICAgIG9yZ2FuaXNhdGlvbnMucHVzaChvcmdhbmlzYXRpb24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRsb2FkRG9jdW1lbnRzOiBmdW5jdGlvbihwYXRoKSB7XHJcblx0XHRcdFx0dmFyIHJlcXVlc3QgPSB7XHJcblx0XHRcdFx0XHRwYXRoOiBwYXRoXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRsb2FkKHJlcXVlc3QpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRub3RpZnlPYnNlcnZlcnMoJ2ltcG9ydGVkJywgcmVzcG9uc2UpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWdpc3RlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdFx0XHRvYnNlcnZlckNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcclxuXHQuZmlsdGVyKCdmaXJzdENoYXJhY3RlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0aWYgKGlucHV0ID09PSB1bmRlZmluZWQgfHwgaW5wdXQgPT09ICcnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gaW5wdXQuY2hhckF0KDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5maWx0ZXIoJ25ld09yZ2FuaXNhdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdFx0cmV0dXJuIGlucHV0ICE9PSAnJyA/IGlucHV0IDogdCgnZG9jdW1lbnRtYW5hZ2VyJywgJ05ldyBvcmdhbmlzYXRpb24nKTtcblx0XHR9O1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmZpbHRlcignb3JnYW5pc2F0aW9uQ29sb3InLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcblx0XHRcdHZhciBoYXNoID0gbWQ1KGlucHV0KS5zdWJzdHJpbmcoMCwgNCksXG5cdFx0XHRcdG1heFJhbmdlID0gcGFyc2VJbnQoJ2ZmZmYnLCAxNiksXG5cdFx0XHRcdGh1ZSA9IHBhcnNlSW50KGhhc2gsIDE2KSAvIG1heFJhbmdlICogMjU2O1xuXHRcdFx0cmV0dXJuICdoc2woJyArIGh1ZSArICcsIDkwJSwgNjUlKSc7XG5cdFx0fTtcblx0fSk7Il19
