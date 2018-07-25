var app = angular.module('documentManagerApp', ['ngRoute', 'angular-cache']);

app.config(['$routeProvider', function($routeProvider) {

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
		/**DocumentService.getAll(ctrl.facets);
		DocumentService.register(function(ev) {
		    if (ev.event === 'imported') {
		        ctrl.facets.push(...ev.documents.data);
			}
		});**/
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
/*globals OC angular t*/
/*eslint-env meteor */
angular.module('documentManagerApp')
	.controller('loadDocumentsButtonCtrl', ['DocumentService', function(DocumentService) {
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
			return ctrl.organisation.id();
		};

		ctrl.name = function() {
			return ctrl.organisation.name();
		};

		ctrl.email = function() {
			return ctrl.organisation.email();
		};

		ctrl.url = function() {
			return ctrl.organisation.url();
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
		DocumentService.register(function(ev) {
		    if (ev.event === 'updatedOrganisation') {
				// TODO: Better only use the imported document from the event. org list is not yet updated
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
			if (ev.event === 'imported') {
				// TODO: We need to check if we have a non initialized document here to show in the dummy org
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
		});
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
/*globals angular */
angular.module('documentManagerApp')
	.factory('NextcloudDocument', function() {
		return function NextcloudDocument(documentData) {
			angular.extend(this, {

				props: {},

				id: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('id', { value: value.toString() });
					} else {
						// getter
						var property = this.getProperty('id');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				fileId: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('fileId', { value: value });
					} else {
						// getter
						var property = this.getProperty('fileId');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				title: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('title', { value: value });
					} else {
						// getter
						var property = this.getProperty('title');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				organisationId: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('organisationId', { value: value });
					} else {
						// getter
						var property = this.getProperty('organisationId');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				creationDate: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('creationDate', { value: value });
					} else {
						// getter
						var property = this.getProperty('creationDate');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				status: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('status', { value: value });
					} else {
						// getter
						var property = this.getProperty('status');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				getProperty: function(propertyName) {
					if (this.props[propertyName]) {
						return this.props[propertyName][0];
					} else {
						return undefined;
					}
				},

				setProperty: function(propertyName, data) {
					if(!this.props[propertyName]) {
						this.props[propertyName] = [];
					}
					this.props[propertyName][0] = data;
				}
			});

			if(angular.isDefined(documentData)) {
				this.id(documentData.id);
				this.fileId(documentData.fileId);
				this.title(documentData.title);
				this.organisationId(documentData.organisationId);
				this.creationDate(documentData.creationDate);
				this.status(documentData.status);
			}
		};
	});
/*globals angular*/
angular.module('documentManagerApp')
	.factory('Organisation', function() {
		return function Organisation(organisationData) {
			angular.extend(this, {

				props: {},

				id: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('id', { value: value.toString() });
					} else {
						// getter
						var property = this.getProperty('id');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				name: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('name', { value: value });
					} else {
						// getter
						var property = this.getProperty('name');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				email: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('email', { value: value });
					} else {
						// getter
						var property = this.getProperty('email');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				url: function(value) {
					if (angular.isDefined(value)) {
						// setter
						return this.setProperty('url', { value: value });
					} else {
						// getter
						var property = this.getProperty('url');
						if (property) {
							return property.value[0];
						} else {
							return undefined;
						}
					}
				},

				getProperty: function(propertyName) {
					if (this.props[propertyName]) {
						return this.props[propertyName][0];
					} else {
						return undefined;
					}
				},

				setProperty: function(propertyName, data) {
					if(!this.props[propertyName]) {
						this.props[propertyName] = [];
					}
					this.props[propertyName][0] = data;
				}
			});

			if(angular.isDefined(organisationData)) {
				this.id(organisationData.id);
				this.name(organisationData.name);
				this.email(organisationData.email);
				this.url(organisationData.url);
			}
		};
	});
/*globals OC angular*/
angular.module('documentManagerApp')
	.factory('DocumentService', ['$q', '$http', 'Organisation', 'NextcloudDocument', 'CacheFactory', function($q, $http, Organisation, NextcloudDocument, CacheFactory) {

		var observerCallbacks = [];
		var documentCacheFilled = false;
		var documentCache = CacheFactory('documents');
		var organisationCacheFilled = false;
		var organisationCache = CacheFactory('organisation');

		var notifyObservers = function(eventName, payload) {
			var ev = {
				event: eventName,
				documents: payload
			};
			angular.forEach(observerCallbacks, function(callback) {
				callback(ev);
			});
		};

		var addDocument = function(documentProperties) {
			var doc = new NextcloudDocument(documentProperties);
			documentCache.put(doc.id(), doc);
			return doc;
		};

		var addOrganisation = function(organisationProperties) {
			var organisation = new Organisation(organisationProperties);
			organisationCache.put(organisation.id(), organisation);
			return organisation;
		};

		var fillDocumentCache = function() {
			return $http.get(OC.generateUrl('/apps/documentmanager/documents')).then(function(response) {
				response.data.forEach(function(documentProperties) {
					addDocument(documentProperties);
				});
				documentCacheFilled = true;
			});
		};

		var loadAllDocuments = function() {
			if(documentCacheFilled === false) {
				return fillDocumentCache().then(function() {
					return documentCache.values();
				});
			} else {
				return $q.when(documentCache.values());
			}
		};

		var fillOrganisationCache = function() {
			return $http.get(OC.generateUrl('/apps/documentmanager/organisations')).then(function(response) {
				response.data.forEach(function(organisationProperties) {
					addOrganisation(organisationProperties);
				});
				organisationCacheFilled = true;
			});
		};

		var loadAllOrganisations = function() {
			if(organisationCacheFilled === false) {
				return fillOrganisationCache().then(function() {
					return organisationCache.values();
				});
			} else {
				return $q.when(organisationCache.values());
			}
		};

		var load = function(path) {
		    var loadRequest = {
				path: path
			};
		    return $http.post(OC.generateUrl('/apps/documentmanager/load'), JSON.stringify(loadRequest));
		};

		var analyze = function(documentId) {
		    var analyzeRequest = {
				id: documentId
			};
		    return $http.post(OC.generateUrl('/apps/documentmanager/analyze'), JSON.stringify(analyzeRequest));
		};

		return {

			getAllDocuments: function(documents) {
				loadAllDocuments().then(function(documentList) {
					documents.push(...documentList);
				});
			},

			getAllOrganisations: function(organisations) {
				loadAllOrganisations().then(function(organisationList) {
					organisations.push(...organisationList);
				});
			},

			loadDocuments: function(path) {
				load(path).then(function(response) {
					response.data.forEach(function(documentProperties) {
						var doc = addDocument(documentProperties);
						notifyObservers('imported', doc);
						analyze(doc.id()).then(function(response) {
					        var doc = addDocument(response.data[0]);
							var organisation = addOrganisation(response.data[1]);
							notifyObservers('updatedDocument', doc);
							notifyObservers('updatedOrganisation', organisation);
						});
					});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwiZmFjZXRMaXN0L2ZhY2V0TGlzdF9jb250cm9sbGVyLmpzIiwiZmFjZXRMaXN0L2ZhY2V0TGlzdF9kaXJlY3RpdmUuanMiLCJsb2FkRG9jdW1lbnRzQnV0dG9uL2xvYWREb2N1bWVudHNCdXR0b25fY29udHJvbGxlci5qcyIsImxvYWREb2N1bWVudHNCdXR0b24vbG9hZERvY3VtZW50c0J1dHRvbl9kaXJlY3RpdmUuanMiLCJvcmdhbmlzYXRpb24vb3JnYW5pc2F0aW9uX2NvbnRyb2xsZXIuanMiLCJvcmdhbmlzYXRpb24vb3JnYW5pc2F0aW9uX2RpcmVjdGl2ZS5qcyIsIm9yZ2FuaXNhdGlvbkxpc3Qvb3JnYW5pc2F0aW9uTGlzdF9jb250cm9sbGVyLmpzIiwib3JnYW5pc2F0aW9uTGlzdC9vcmdhbmlzYXRpb25MaXN0X2RpcmVjdGl2ZS5qcyIsImRvY3VtZW50X21vZGVsLmpzIiwib3JnYW5pc2F0aW9uX21vZGVsLmpzIiwiZG9jdW1lbnRTZXJ2aWNlLmpzIiwiZmlyc3RDaGFyYWN0ZXJfZmlsdGVyLmpzIiwibmV3T3JnYW5pc2F0aW9uX2ZpbHRlci5qcyIsIm9yZ2FuaXNhdGlvbkNvbG9yX2ZpbHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE1BQU0sUUFBUSxPQUFPLHNCQUFzQixDQUFDLFdBQVc7O0FBRTNELElBQUksMEJBQU8sU0FBUyxnQkFBZ0I7O0NBRW5DLGVBQWUsS0FBSyxTQUFTO0VBQzVCLFVBQVU7OztDQUdYLGVBQWUsS0FBSyxpQkFBaUI7RUFDcEMsWUFBWSxTQUFTLFlBQVk7R0FDaEMsT0FBTyxNQUFNLEVBQUUsYUFBYSxtQkFBbUIsTUFBTSxXQUFXOzs7O0NBSWxFLGVBQWUsS0FBSyxhQUFhO0VBQ2hDLFVBQVU7OztDQUdYLGVBQWUsVUFBVSxNQUFNLEVBQUUsYUFBYTs7OztBQUkvQyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsU0FBUyxlQUFlOztDQUVwRCxjQUFjLFNBQVMsUUFBUSxPQUFP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QkFBdUIsS0FBSyxTQUFTLGtCQUFrQjtLQUN0RCxjQUFjLEtBQUs7Ozs7R0FJckIsZUFBZSxTQUFTLE1BQU07SUFDN0IsS0FBSyxNQUFNLEtBQUssU0FBUyxVQUFVO0tBQ2xDLFNBQVMsS0FBSyxRQUFRLFNBQVMsb0JBQW9CO01BQ2xELElBQUksTUFBTSxZQUFZO01BQ3RCLGdCQUFnQixZQUFZO01BQzVCLFFBQVEsSUFBSSxNQUFNLEtBQUssU0FBUyxVQUFVO2FBQ25DLElBQUksTUFBTSxZQUFZLFNBQVMsS0FBSztPQUMxQyxJQUFJLGVBQWUsZ0JBQWdCLFNBQVMsS0FBSztPQUNqRCxnQkFBZ0IsbUJBQW1CO09BQ25DLGdCQUFnQix1QkFBdUI7Ozs7OztHQU0zQyxVQUFVLFNBQVMsVUFBVTtJQUM1QixrQkFBa0IsS0FBSzs7O0tBR3ZCO0FDckhKLFFBQVEsT0FBTztFQUNiLE9BQU8sa0JBQWtCLFdBQVc7RUFDcEMsT0FBTyxTQUFTLE9BQU87R0FDdEIsSUFBSTtJQUNILElBQUksVUFBVSxhQUFhLFVBQVUsSUFBSTtLQUN4QyxPQUFPOztJQUVSLE9BQU8sTUFBTSxPQUFPOztHQUVyQixNQUFNLEtBQUs7SUFDVixPQUFPOzs7SUFHUDtBQ2JKLFFBQVEsT0FBTztFQUNiLE9BQU8sbUJBQW1CLFdBQVc7RUFDckMsT0FBTyxTQUFTLE9BQU87R0FDdEIsT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFLG1CQUFtQjs7SUFFbEQ7QUNMSixRQUFRLE9BQU87RUFDYixPQUFPLHFCQUFxQixXQUFXO0VBQ3ZDLE9BQU8sU0FBUyxPQUFPO0dBQ3RCLElBQUksT0FBTyxJQUFJLE9BQU8sVUFBVSxHQUFHO0lBQ2xDLFdBQVcsU0FBUyxRQUFRO0lBQzVCLE1BQU0sU0FBUyxNQUFNLE1BQU0sV0FBVztHQUN2QyxPQUFPLFNBQVMsTUFBTTs7SUFFckIiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnLCBbJ25nUm91dGUnLCAnYW5ndWxhci1jYWNoZSddKTtcclxuXHJcbmFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuXHJcblx0JHJvdXRlUHJvdmlkZXIud2hlbignLzpnaWQnLCB7XHJcblx0XHR0ZW1wbGF0ZTogJzxkb2N1bWVudGRldGFpbHM+PC9kb2N1bWVudGRldGFpbHM+J1xyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci53aGVuKCcvZG9jdW1lbnQvOmlkJywge1xyXG5cdFx0cmVkaXJlY3RUbzogZnVuY3Rpb24ocGFyYW1ldGVycykge1xyXG5cdFx0XHRyZXR1cm4gJy8nICsgdCgnZG9jdW1lbnRzJywgJ0FsbCBkb2N1bWVudHMnKSArICcvJyArIHBhcmFtZXRlcnMudWlkO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci53aGVuKCcvOmdpZC86aWQnLCB7XHJcblx0XHR0ZW1wbGF0ZTogJzxkb2N1bWVudGRldGFpbHM+PC9kb2N1bWVudGRldGFpbHM+J1xyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci5vdGhlcndpc2UoJy8nICsgdCgnZG9jdW1lbnRzJywgJ0FsbCBkb2N1bWVudHMnKSk7XHJcblxyXG59KTtcclxuXHJcbmFwcC5jb25maWcoWyckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xyXG5cdC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSovXHJcblx0JGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbi5yZXF1ZXN0dG9rZW4gPSBvY19yZXF1ZXN0dG9rZW47XHJcblx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UqL1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5jb250cm9sbGVyKCdmYWNldGxpc3RDdHJsJywgZnVuY3Rpb24oRG9jdW1lbnRTZXJ2aWNlKSB7XG5cdFx0dmFyIGN0cmwgPSB0aGlzO1xuXHRcdGN0cmwuZmFjZXRzID0gW107XG5cdFx0LyoqRG9jdW1lbnRTZXJ2aWNlLmdldEFsbChjdHJsLmZhY2V0cyk7XG5cdFx0RG9jdW1lbnRTZXJ2aWNlLnJlZ2lzdGVyKGZ1bmN0aW9uKGV2KSB7XG5cdFx0ICAgIGlmIChldi5ldmVudCA9PT0gJ2ltcG9ydGVkJykge1xuXHRcdCAgICAgICAgY3RybC5mYWNldHMucHVzaCguLi5ldi5kb2N1bWVudHMuZGF0YSk7XG5cdFx0XHR9XG5cdFx0fSk7KiovXG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZGlyZWN0aXZlKCdmYWNldGxpc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnZmFjZXRsaXN0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnZG9jdW1lbnRtYW5hZ2VyJywgJ3RlbXBsYXRlcy9uYXZpZ2F0aW9uL2ZhY2V0TGlzdC5odG1sJylcblx0XHR9O1xuXHR9KTsiLCIvKmdsb2JhbHMgT0MgYW5ndWxhciB0Ki9cbi8qZXNsaW50LWVudiBtZXRlb3IgKi9cbmFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuY29udHJvbGxlcignbG9hZERvY3VtZW50c0J1dHRvbkN0cmwnLCBmdW5jdGlvbihEb2N1bWVudFNlcnZpY2UpIHtcblx0XHR2YXIgY3RybCA9IHRoaXM7XG5cdFx0Y3RybC50ID0ge1xuXHRcdFx0bG9hZERvY3VtZW50cyA6IHQoJ2RvY3VtZW50bWFuYWdlcicsICdMb2FkIGRvY3VtZW50KHMpJylcblx0XHR9O1xuXHRcdGN0cmwubG9hZERvY3VtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRpdGxlID0gdCgnZG9jdW1lbnRtYW5hZ2VyJywgJ0Nob29zZSBkb2N1bWVudCB0byBsb2FkIGludG8gRG9jdW1lbnQgTWFuYWdlcicpO1xuXHRcdFx0dmFyIG1pbWV0eXBlcyA9IFsnaHR0cGQvdW5peC1kaXJlY3RvcnknLCAnYXBwbGljYXRpb24vcGRmJ107XG5cdFx0ICAgIE9DLmRpYWxvZ3MuZmlsZXBpY2tlcih0aXRsZSwgXy5iaW5kKHRoaXMub25DbG91ZEZpbGVTZWxlY3RlZCwgdGhpcyksIGZhbHNlLCBtaW1ldHlwZXMpO1xuXHRcdH07XG5cdFx0Y3RybC5vbkNsb3VkRmlsZVNlbGVjdGVkID0gZnVuY3Rpb24ocGF0aCkge1xuXHRcdFx0RG9jdW1lbnRTZXJ2aWNlLmxvYWREb2N1bWVudHMocGF0aCk7XG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5kaXJlY3RpdmUoJ2xvYWRkb2N1bWVudHNidXR0b24nLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnbG9hZERvY3VtZW50c0J1dHRvbkN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7fSxcblx0XHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2RvY3VtZW50bWFuYWdlcicsICd0ZW1wbGF0ZXMvbmF2aWdhdGlvbi9sb2FkRG9jdW1lbnRzQnV0dG9uLmh0bWwnKVxuXHRcdH07XG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuY29udHJvbGxlcignb3JnYW5pc2F0aW9uQ3RybCcsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdHJsID0gdGhpcztcblxuXHRcdGN0cmwuZ2V0U2VsZWN0ZWRJZCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHJldHVybiAxO1xuXHQgICAgfTtcblxuXHRcdGN0cmwuaWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjdHJsLm9yZ2FuaXNhdGlvbi5pZCgpO1xuXHRcdH07XG5cblx0XHRjdHJsLm5hbWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjdHJsLm9yZ2FuaXNhdGlvbi5uYW1lKCk7XG5cdFx0fTtcblxuXHRcdGN0cmwuZW1haWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjdHJsLm9yZ2FuaXNhdGlvbi5lbWFpbCgpO1xuXHRcdH07XG5cblx0XHRjdHJsLnVybCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN0cmwub3JnYW5pc2F0aW9uLnVybCgpO1xuXHRcdH07XG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZGlyZWN0aXZlKCdvcmdhbmlzYXRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2NvcGU6IHt9LFxuXHRcdFx0Y29udHJvbGxlcjogJ29yZ2FuaXNhdGlvbkN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdG9yZ2FuaXNhdGlvbjogJz1kYXRhJ1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2RvY3VtZW50bWFuYWdlcicsICd0ZW1wbGF0ZXMvb3JnYW5pc2F0aW9ubGlzdC9vcmdhbmlzYXRpb24uaHRtbCcpXG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5jb250cm9sbGVyKCdvcmdhbmlzYXRpb25saXN0Q3RybCcsIGZ1bmN0aW9uKERvY3VtZW50U2VydmljZSkge1xuXHRcdHZhciBjdHJsID0gdGhpcztcblx0XHRjdHJsLm9yZ2FuaXNhdGlvbnMgPSBbXTtcblx0XHREb2N1bWVudFNlcnZpY2UucmVnaXN0ZXIoZnVuY3Rpb24oZXYpIHtcblx0XHQgICAgaWYgKGV2LmV2ZW50ID09PSAndXBkYXRlZE9yZ2FuaXNhdGlvbicpIHtcblx0XHRcdFx0Ly8gVE9ETzogQmV0dGVyIG9ubHkgdXNlIHRoZSBpbXBvcnRlZCBkb2N1bWVudCBmcm9tIHRoZSBldmVudC4gb3JnIGxpc3QgaXMgbm90IHlldCB1cGRhdGVkXG5cdFx0XHRcdERvY3VtZW50U2VydmljZS5nZXRBbGxPcmdhbmlzYXRpb25zKGN0cmwub3JnYW5pc2F0aW9ucyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXYuZXZlbnQgPT09ICdpbXBvcnRlZCcpIHtcblx0XHRcdFx0Ly8gVE9ETzogV2UgbmVlZCB0byBjaGVjayBpZiB3ZSBoYXZlIGEgbm9uIGluaXRpYWxpemVkIGRvY3VtZW50IGhlcmUgdG8gc2hvdyBpbiB0aGUgZHVtbXkgb3JnXG5cdFx0XHRcdERvY3VtZW50U2VydmljZS5nZXRBbGxPcmdhbmlzYXRpb25zKGN0cmwub3JnYW5pc2F0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0RG9jdW1lbnRTZXJ2aWNlLmdldEFsbE9yZ2FuaXNhdGlvbnMoY3RybC5vcmdhbmlzYXRpb25zKTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5kaXJlY3RpdmUoJ29yZ2FuaXNhdGlvbmxpc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnb3JnYW5pc2F0aW9ubGlzdEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7fSxcblx0XHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2RvY3VtZW50bWFuYWdlcicsICd0ZW1wbGF0ZXMvZnJhZ21lbnRzL29yZ2FuaXNhdGlvbkxpc3QuaHRtbCcpXG5cdFx0fTtcblx0fSk7IiwiLypnbG9iYWxzIGFuZ3VsYXIgKi9cbmFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZmFjdG9yeSgnTmV4dGNsb3VkRG9jdW1lbnQnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gTmV4dGNsb3VkRG9jdW1lbnQoZG9jdW1lbnREYXRhKSB7XG5cdFx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLCB7XG5cblx0XHRcdFx0cHJvcHM6IHt9LFxuXG5cdFx0XHRcdGlkOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdC8vIHNldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoJ2lkJywgeyB2YWx1ZTogdmFsdWUudG9TdHJpbmcoKSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdpZCcpO1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZVswXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGZpbGVJZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFByb3BlcnR5KCdmaWxlSWQnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdmaWxlSWQnKTtcblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWVbMF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHR0aXRsZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFByb3BlcnR5KCd0aXRsZScsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRcdHZhciBwcm9wZXJ0eSA9IHRoaXMuZ2V0UHJvcGVydHkoJ3RpdGxlJyk7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlWzBdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0b3JnYW5pc2F0aW9uSWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRQcm9wZXJ0eSgnb3JnYW5pc2F0aW9uSWQnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdvcmdhbmlzYXRpb25JZCcpO1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZVswXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGNyZWF0aW9uRGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFByb3BlcnR5KCdjcmVhdGlvbkRhdGUnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdjcmVhdGlvbkRhdGUnKTtcblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWVbMF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRQcm9wZXJ0eSgnc3RhdHVzJywgeyB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGdldHRlclxuXHRcdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgnc3RhdHVzJyk7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlWzBdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Z2V0UHJvcGVydHk6IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLnByb3BzW3Byb3BlcnR5TmFtZV0pIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnByb3BzW3Byb3BlcnR5TmFtZV1bMF07XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHNldFByb3BlcnR5OiBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIGRhdGEpIHtcblx0XHRcdFx0XHRpZighdGhpcy5wcm9wc1twcm9wZXJ0eU5hbWVdKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnByb3BzW3Byb3BlcnR5TmFtZV0gPSBbXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5wcm9wc1twcm9wZXJ0eU5hbWVdWzBdID0gZGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmKGFuZ3VsYXIuaXNEZWZpbmVkKGRvY3VtZW50RGF0YSkpIHtcblx0XHRcdFx0dGhpcy5pZChkb2N1bWVudERhdGEuaWQpO1xuXHRcdFx0XHR0aGlzLmZpbGVJZChkb2N1bWVudERhdGEuZmlsZUlkKTtcblx0XHRcdFx0dGhpcy50aXRsZShkb2N1bWVudERhdGEudGl0bGUpO1xuXHRcdFx0XHR0aGlzLm9yZ2FuaXNhdGlvbklkKGRvY3VtZW50RGF0YS5vcmdhbmlzYXRpb25JZCk7XG5cdFx0XHRcdHRoaXMuY3JlYXRpb25EYXRlKGRvY3VtZW50RGF0YS5jcmVhdGlvbkRhdGUpO1xuXHRcdFx0XHR0aGlzLnN0YXR1cyhkb2N1bWVudERhdGEuc3RhdHVzKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTsiLCIvKmdsb2JhbHMgYW5ndWxhciovXG5hbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmZhY3RvcnkoJ09yZ2FuaXNhdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiBPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uRGF0YSkge1xuXHRcdFx0YW5ndWxhci5leHRlbmQodGhpcywge1xuXG5cdFx0XHRcdHByb3BzOiB7fSxcblxuXHRcdFx0XHRpZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFByb3BlcnR5KCdpZCcsIHsgdmFsdWU6IHZhbHVlLnRvU3RyaW5nKCkgfSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGdldHRlclxuXHRcdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgnaWQnKTtcblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWVbMF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRuYW1lOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdC8vIHNldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoJ25hbWUnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCduYW1lJyk7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlWzBdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0ZW1haWw6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRQcm9wZXJ0eSgnZW1haWwnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdlbWFpbCcpO1xuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZVswXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHVybDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFByb3BlcnR5KCd1cmwnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCd1cmwnKTtcblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWVbMF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRnZXRQcm9wZXJ0eTogZnVuY3Rpb24ocHJvcGVydHlOYW1lKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMucHJvcHNbcHJvcGVydHlOYW1lXSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcHNbcHJvcGVydHlOYW1lXVswXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0c2V0UHJvcGVydHk6IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgZGF0YSkge1xuXHRcdFx0XHRcdGlmKCF0aGlzLnByb3BzW3Byb3BlcnR5TmFtZV0pIHtcblx0XHRcdFx0XHRcdHRoaXMucHJvcHNbcHJvcGVydHlOYW1lXSA9IFtdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnByb3BzW3Byb3BlcnR5TmFtZV1bMF0gPSBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYoYW5ndWxhci5pc0RlZmluZWQob3JnYW5pc2F0aW9uRGF0YSkpIHtcblx0XHRcdFx0dGhpcy5pZChvcmdhbmlzYXRpb25EYXRhLmlkKTtcblx0XHRcdFx0dGhpcy5uYW1lKG9yZ2FuaXNhdGlvbkRhdGEubmFtZSk7XG5cdFx0XHRcdHRoaXMuZW1haWwob3JnYW5pc2F0aW9uRGF0YS5lbWFpbCk7XG5cdFx0XHRcdHRoaXMudXJsKG9yZ2FuaXNhdGlvbkRhdGEudXJsKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTsiLCIvKmdsb2JhbHMgT0MgYW5ndWxhciovXG5hbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcclxuXHQuZmFjdG9yeSgnRG9jdW1lbnRTZXJ2aWNlJywgZnVuY3Rpb24oJHEsICRodHRwLCBPcmdhbmlzYXRpb24sIE5leHRjbG91ZERvY3VtZW50LCBDYWNoZUZhY3RvcnkpIHtcclxuXHJcblx0XHR2YXIgb2JzZXJ2ZXJDYWxsYmFja3MgPSBbXTtcblx0XHR2YXIgZG9jdW1lbnRDYWNoZUZpbGxlZCA9IGZhbHNlO1xuXHRcdHZhciBkb2N1bWVudENhY2hlID0gQ2FjaGVGYWN0b3J5KCdkb2N1bWVudHMnKTtcblx0XHR2YXIgb3JnYW5pc2F0aW9uQ2FjaGVGaWxsZWQgPSBmYWxzZTtcblx0XHR2YXIgb3JnYW5pc2F0aW9uQ2FjaGUgPSBDYWNoZUZhY3RvcnkoJ29yZ2FuaXNhdGlvbicpO1xyXG5cclxuXHRcdHZhciBub3RpZnlPYnNlcnZlcnMgPSBmdW5jdGlvbihldmVudE5hbWUsIHBheWxvYWQpIHtcclxuXHRcdFx0dmFyIGV2ID0ge1xyXG5cdFx0XHRcdGV2ZW50OiBldmVudE5hbWUsXHJcblx0XHRcdFx0ZG9jdW1lbnRzOiBwYXlsb2FkXHJcblx0XHRcdH07XHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChvYnNlcnZlckNhbGxiYWNrcywgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdFx0XHRjYWxsYmFjayhldik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXG5cdFx0dmFyIGFkZERvY3VtZW50ID0gZnVuY3Rpb24oZG9jdW1lbnRQcm9wZXJ0aWVzKSB7XG5cdFx0XHR2YXIgZG9jID0gbmV3IE5leHRjbG91ZERvY3VtZW50KGRvY3VtZW50UHJvcGVydGllcyk7XG5cdFx0XHRkb2N1bWVudENhY2hlLnB1dChkb2MuaWQoKSwgZG9jKTtcblx0XHRcdHJldHVybiBkb2M7XG5cdFx0fTtcblxuXHRcdHZhciBhZGRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbihvcmdhbmlzYXRpb25Qcm9wZXJ0aWVzKSB7XG5cdFx0XHR2YXIgb3JnYW5pc2F0aW9uID0gbmV3IE9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb25Qcm9wZXJ0aWVzKTtcblx0XHRcdG9yZ2FuaXNhdGlvbkNhY2hlLnB1dChvcmdhbmlzYXRpb24uaWQoKSwgb3JnYW5pc2F0aW9uKTtcblx0XHRcdHJldHVybiBvcmdhbmlzYXRpb247XG5cdFx0fTtcblxuXHRcdHZhciBmaWxsRG9jdW1lbnRDYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChPQy5nZW5lcmF0ZVVybCgnL2FwcHMvZG9jdW1lbnRtYW5hZ2VyL2RvY3VtZW50cycpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHJlc3BvbnNlLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2N1bWVudFByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRhZGREb2N1bWVudChkb2N1bWVudFByb3BlcnRpZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZG9jdW1lbnRDYWNoZUZpbGxlZCA9IHRydWU7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dmFyIGxvYWRBbGxEb2N1bWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmKGRvY3VtZW50Q2FjaGVGaWxsZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHJldHVybiBmaWxsRG9jdW1lbnRDYWNoZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRvY3VtZW50Q2FjaGUudmFsdWVzKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICRxLndoZW4oZG9jdW1lbnRDYWNoZS52YWx1ZXMoKSk7XG5cdFx0XHR9XHJcblx0XHR9O1xuXG5cdFx0dmFyIGZpbGxPcmdhbmlzYXRpb25DYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChPQy5nZW5lcmF0ZVVybCgnL2FwcHMvZG9jdW1lbnRtYW5hZ2VyL29yZ2FuaXNhdGlvbnMnKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRyZXNwb25zZS5kYXRhLmZvckVhY2goZnVuY3Rpb24ob3JnYW5pc2F0aW9uUHJvcGVydGllcykge1xuXHRcdFx0XHRcdGFkZE9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb25Qcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdG9yZ2FuaXNhdGlvbkNhY2hlRmlsbGVkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR2YXIgbG9hZEFsbE9yZ2FuaXNhdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmKG9yZ2FuaXNhdGlvbkNhY2hlRmlsbGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXR1cm4gZmlsbE9yZ2FuaXNhdGlvbkNhY2hlKCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3JnYW5pc2F0aW9uQ2FjaGUudmFsdWVzKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICRxLndoZW4ob3JnYW5pc2F0aW9uQ2FjaGUudmFsdWVzKCkpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR2YXIgbG9hZCA9IGZ1bmN0aW9uKHBhdGgpIHtcblx0XHQgICAgdmFyIGxvYWRSZXF1ZXN0ID0ge1xuXHRcdFx0XHRwYXRoOiBwYXRoXG5cdFx0XHR9O1xyXG5cdFx0ICAgIHJldHVybiAkaHR0cC5wb3N0KE9DLmdlbmVyYXRlVXJsKCcvYXBwcy9kb2N1bWVudG1hbmFnZXIvbG9hZCcpLCBKU09OLnN0cmluZ2lmeShsb2FkUmVxdWVzdCkpO1xyXG5cdFx0fTtcblxuXHRcdHZhciBhbmFseXplID0gZnVuY3Rpb24oZG9jdW1lbnRJZCkge1xuXHRcdCAgICB2YXIgYW5hbHl6ZVJlcXVlc3QgPSB7XG5cdFx0XHRcdGlkOiBkb2N1bWVudElkXG5cdFx0XHR9O1xuXHRcdCAgICByZXR1cm4gJGh0dHAucG9zdChPQy5nZW5lcmF0ZVVybCgnL2FwcHMvZG9jdW1lbnRtYW5hZ2VyL2FuYWx5emUnKSwgSlNPTi5zdHJpbmdpZnkoYW5hbHl6ZVJlcXVlc3QpKTtcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XG5cclxuXHRcdFx0Z2V0QWxsRG9jdW1lbnRzOiBmdW5jdGlvbihkb2N1bWVudHMpIHtcclxuXHRcdFx0XHRsb2FkQWxsRG9jdW1lbnRzKCkudGhlbihmdW5jdGlvbihkb2N1bWVudExpc3QpIHtcclxuXHRcdFx0XHRcdGRvY3VtZW50cy5wdXNoKC4uLmRvY3VtZW50TGlzdCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXG5cclxuXHRcdFx0Z2V0QWxsT3JnYW5pc2F0aW9uczogZnVuY3Rpb24ob3JnYW5pc2F0aW9ucykge1xyXG5cdFx0XHRcdGxvYWRBbGxPcmdhbmlzYXRpb25zKCkudGhlbihmdW5jdGlvbihvcmdhbmlzYXRpb25MaXN0KSB7XG5cdFx0XHRcdFx0b3JnYW5pc2F0aW9ucy5wdXNoKC4uLm9yZ2FuaXNhdGlvbkxpc3QpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxuXG5cdFx0XHRsb2FkRG9jdW1lbnRzOiBmdW5jdGlvbihwYXRoKSB7XG5cdFx0XHRcdGxvYWQocGF0aCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2N1bWVudFByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdHZhciBkb2MgPSBhZGREb2N1bWVudChkb2N1bWVudFByb3BlcnRpZXMpO1xuXHRcdFx0XHRcdFx0bm90aWZ5T2JzZXJ2ZXJzKCdpbXBvcnRlZCcsIGRvYyk7XG5cdFx0XHRcdFx0XHRhbmFseXplKGRvYy5pZCgpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0ICAgICAgICB2YXIgZG9jID0gYWRkRG9jdW1lbnQocmVzcG9uc2UuZGF0YVswXSk7XG5cdFx0XHRcdFx0XHRcdHZhciBvcmdhbmlzYXRpb24gPSBhZGRPcmdhbmlzYXRpb24ocmVzcG9uc2UuZGF0YVsxXSk7XG5cdFx0XHRcdFx0XHRcdG5vdGlmeU9ic2VydmVycygndXBkYXRlZERvY3VtZW50JywgZG9jKTtcblx0XHRcdFx0XHRcdFx0bm90aWZ5T2JzZXJ2ZXJzKCd1cGRhdGVkT3JnYW5pc2F0aW9uJywgb3JnYW5pc2F0aW9uKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cblx0XHRcdHJlZ2lzdGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0XHRcdG9ic2VydmVyQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxyXG5cdC5maWx0ZXIoJ2ZpcnN0Q2hhcmFjdGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCB8fCBpbnB1dCA9PT0gJycpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBpbnB1dC5jaGFyQXQoMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdFx0cmV0dXJuICcwJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmZpbHRlcignbmV3T3JnYW5pc2F0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0XHRyZXR1cm4gaW5wdXQgIT09ICcnID8gaW5wdXQgOiB0KCdkb2N1bWVudG1hbmFnZXInLCAnTmV3IG9yZ2FuaXNhdGlvbicpO1xuXHRcdH07XG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZmlsdGVyKCdvcmdhbmlzYXRpb25Db2xvcicsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdFx0dmFyIGhhc2ggPSBtZDUoaW5wdXQpLnN1YnN0cmluZygwLCA0KSxcblx0XHRcdFx0bWF4UmFuZ2UgPSBwYXJzZUludCgnZmZmZicsIDE2KSxcblx0XHRcdFx0aHVlID0gcGFyc2VJbnQoaGFzaCwgMTYpIC8gbWF4UmFuZ2UgKiAyNTY7XG5cdFx0XHRyZXR1cm4gJ2hzbCgnICsgaHVlICsgJywgOTAlLCA2NSUpJztcblx0XHR9O1xuXHR9KTsiXX0=
