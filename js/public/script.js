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
		    if (ev.event === 'imported') {
				// TODO: Better only get the imported documents from the event. org list is not yet updated
				DocumentService.getAllOrganisations(ctrl.organisations);
			}
			if (ev.event === 'imported') {
				// TODO: Better only get the imported documents from the event. org list is not yet updated
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
angular.module('documentManagerApp')
	.factory('Document', function() {
		return function Document(documentData) {

			angular.extend(this, {

				data: {},

				id: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('id', { value: value });
					} else {
						// getter
						return model.getProperty('id').value;
					}
				},

				organisationId: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('organisation_id', { value: value });
					} else {
						// getter
						return model.getProperty('organisation_id').value;
					}
				}

			});

			if(angular.isDefined(documentData)) {
				angular.extend(this.data, documentData);
			}

		};
	});
angular.module('documentManagerApp')
	.factory('Organisation', function() {
		return function Organisation(organisationData) {

			angular.extend(this, {

				data: {},

				id: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('id', { value: value });
					} else {
						// getter
						return model.getProperty('id').value;
					}
				},

				name: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('name', { value: value });
					} else {
						// getter
						return model.getProperty('name').value;
					}
				},

				logo: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('logo', { value: value });
					} else {
						// getter
						return model.getProperty('logo').value;
					}
				},

				logoDate: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('logo_date', { value: value });
					} else {
						// getter
						return model.getProperty('logo_date').value;
					}
				},

				email: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('email', { value: value });
					} else {
						// getter
						return model.getProperty('email').value;
					}
				},

				url: function(value) {
					var model = this;
					if (angular.isDefined(value)) {
						// setter
						return model.setProperty('url', { value: value });
					} else {
						// getter
						return model.getProperty('url').value;
					}
				}

			});

			if(angular.isDefined(organisationData)) {
				angular.extend(this.data, organisationData);
			}

		};
	});
/*globals OC angular*/
angular.module('documentManagerApp')
	.factory('DocumentService', ['$q', '$http', 'Organisation', 'Document', 'CacheFactory', function($q, $http, Organisation, Document, CacheFactory) {

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

		var addDocument = function(documentProperties) {
			var document = new Document(documentProperties);
			documentCache.put(document.id(), document);
		};

		var addOrganisation = function(organisationProperties) {
			var organisation = new Organisation(organisationProperties);
			organisationCache.put(organisation.id(), organisation);
		};

		// TODO: Do not return http response but add documents and organisations to cache and return both; Server also needs to return both
		var load = function(request) {
		    return $http.post(OC.generateUrl('/apps/documentmanager/load'), JSON.stringify(request));
		};

		var analyze = function(request) {
		    return $http.post(OC.generateUrl('/apps/documentmanager/analyze'), JSON.stringify(request));
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

			// TODO: Return new Document and Organisation objects in separate events
			loadDocuments: function(path) {
				var loadrequest = {
					path: path
				};
				load(loadrequest).then(function (response) {
					// TODO: Add loaded documents to cache
					notifyObservers('imported', response);

					// TODO: Extend API to take more than one key at a time
					var analyzeRequest = {
						id: response[0]['id']
					};
					analyze(analyzeRequest).then(function (response) {
						// TODO: Update documents in cache
						notifyObservers('analyzed', response);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwiZmFjZXRMaXN0L2ZhY2V0TGlzdF9jb250cm9sbGVyLmpzIiwiZmFjZXRMaXN0L2ZhY2V0TGlzdF9kaXJlY3RpdmUuanMiLCJsb2FkRG9jdW1lbnRzQnV0dG9uL2xvYWREb2N1bWVudHNCdXR0b25fY29udHJvbGxlci5qcyIsImxvYWREb2N1bWVudHNCdXR0b24vbG9hZERvY3VtZW50c0J1dHRvbl9kaXJlY3RpdmUuanMiLCJvcmdhbmlzYXRpb24vb3JnYW5pc2F0aW9uX2NvbnRyb2xsZXIuanMiLCJvcmdhbmlzYXRpb24vb3JnYW5pc2F0aW9uX2RpcmVjdGl2ZS5qcyIsIm9yZ2FuaXNhdGlvbkxpc3Qvb3JnYW5pc2F0aW9uTGlzdF9jb250cm9sbGVyLmpzIiwib3JnYW5pc2F0aW9uTGlzdC9vcmdhbmlzYXRpb25MaXN0X2RpcmVjdGl2ZS5qcyIsImRvY3VtZW50X21vZGVsLmpzIiwib3JnYW5pc2F0aW9uX21vZGVsLmpzIiwiZG9jdW1lbnRTZXJ2aWNlLmpzIiwiZmlyc3RDaGFyYWN0ZXJfZmlsdGVyLmpzIiwibmV3T3JnYW5pc2F0aW9uX2ZpbHRlci5qcyIsIm9yZ2FuaXNhdGlvbkNvbG9yX2ZpbHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE1BQU0sUUFBUSxPQUFPLHNCQUFzQixDQUFDLFdBQVc7O0FBRTNELElBQUksMEJBQU8sU0FBUyxnQkFBZ0I7O0NBRW5DLGVBQWUsS0FBSyxTQUFTO0VBQzVCLFVBQVU7OztDQUdYLGVBQWUsS0FBSyxpQkFBaUI7RUFDcEMsWUFBWSxTQUFTLFlBQVk7R0FDaEMsT0FBTyxNQUFNLEVBQUUsYUFBYSxtQkFBbUIsTUFBTSxXQUFXOzs7O0NBSWxFLGVBQWUsS0FBSyxhQUFhO0VBQ2hDLFVBQVU7OztDQUdYLGVBQWUsVUFBVSxNQUFNLEVBQUUsYUFBYTs7OztBQUkvQyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsU0FBUyxlQUFlOztDQUVwRCxjQUFjLFNBQVMsUUFBUSxPQUFPLGVBQWU7O0lBRWxEO0FDMUJKLFFBQVEsT0FBTztFQUNiLFdBQVcscUNBQWlCLFNBQVMsaUJBQWlCO0VBQ3RELElBQUksT0FBTztFQUNYLEtBQUssU0FBUzs7Ozs7OztLQU9aO0FDVkosUUFBUSxPQUFPO0VBQ2IsVUFBVSxhQUFhLFdBQVc7RUFDbEMsT0FBTztHQUNOLFVBQVU7R0FDVixPQUFPO0dBQ1AsWUFBWTtHQUNaLGNBQWM7R0FDZCxrQkFBa0I7R0FDbEIsYUFBYSxHQUFHLE9BQU8sbUJBQW1COztJQUV6QztBQ1ZKLFFBQVEsT0FBTztFQUNiLFdBQVcsd0RBQTJCLFNBQVMsT0FBTyxpQkFBaUI7RUFDdkUsSUFBSSxPQUFPO0VBQ1gsS0FBSyxJQUFJO0dBQ1IsZ0JBQWdCLEVBQUUsbUJBQW1COztFQUV0QyxLQUFLLGdCQUFnQixXQUFXO0dBQy9CLElBQUksUUFBUSxFQUFFLG1CQUFtQjtHQUNqQyxJQUFJLFlBQVksQ0FBQyx3QkFBd0I7TUFDdEMsR0FBRyxRQUFRLFdBQVcsT0FBTyxFQUFFLEtBQUssS0FBSyxxQkFBcUIsT0FBTyxPQUFPOztFQUVoRixLQUFLLHNCQUFzQixTQUFTLE1BQU07R0FDekMsZ0JBQWdCLGNBQWM7O0tBRTdCO0FDZEosUUFBUSxPQUFPO0VBQ2IsVUFBVSx1QkFBdUIsV0FBVztFQUM1QyxPQUFPO0dBQ04sVUFBVTtHQUNWLE9BQU87R0FDUCxZQUFZO0dBQ1osY0FBYztHQUNkLGtCQUFrQjtHQUNsQixhQUFhLEdBQUcsT0FBTyxtQkFBbUI7O0lBRXpDO0FDVkosUUFBUSxPQUFPO0VBQ2IsV0FBVyxvQkFBb0IsV0FBVztFQUMxQyxJQUFJLE9BQU87O0VBRVgsS0FBSyxnQkFBZ0IsV0FBVztTQUN6QixPQUFPOzs7RUFHZCxLQUFLLEtBQUssV0FBVztHQUNwQixPQUFPLEtBQUssYUFBYTs7O0VBRzFCLEtBQUssT0FBTyxXQUFXO0dBQ3RCLE9BQU8sS0FBSyxhQUFhOzs7RUFHMUIsS0FBSyxRQUFRLFdBQVc7R0FDdkIsT0FBTyxLQUFLLGFBQWE7OztFQUcxQixLQUFLLE1BQU0sV0FBVztHQUNyQixPQUFPLEtBQUssYUFBYTs7SUFFeEI7QUN2QkosUUFBUSxPQUFPO0VBQ2IsVUFBVSxnQkFBZ0IsV0FBVztFQUNyQyxPQUFPO0dBQ04sT0FBTztHQUNQLFlBQVk7R0FDWixjQUFjO0dBQ2Qsa0JBQWtCO0lBQ2pCLGNBQWM7O0dBRWYsYUFBYSxHQUFHLE9BQU8sbUJBQW1COztJQUV6QztBQ1hKLFFBQVEsT0FBTztFQUNiLFdBQVcsNENBQXdCLFNBQVMsaUJBQWlCO0VBQzdELElBQUksT0FBTztFQUNYLEtBQUssZ0JBQWdCO0VBQ3JCLGdCQUFnQixTQUFTLFNBQVMsSUFBSTtNQUNsQyxJQUFJLEdBQUcsVUFBVSxZQUFZOztJQUUvQixnQkFBZ0Isb0JBQW9CLEtBQUs7O0dBRTFDLElBQUksR0FBRyxVQUFVLFlBQVk7O0lBRTVCLGdCQUFnQixvQkFBb0IsS0FBSzs7O0VBRzNDLGdCQUFnQixvQkFBb0IsS0FBSztLQUN2QztBQ2ZKLFFBQVEsT0FBTztFQUNiLFVBQVUsb0JBQW9CLFdBQVc7RUFDekMsT0FBTztHQUNOLFVBQVU7R0FDVixPQUFPO0dBQ1AsWUFBWTtHQUNaLGNBQWM7R0FDZCxrQkFBa0I7R0FDbEIsYUFBYSxHQUFHLE9BQU8sbUJBQW1COztJQUV6QztBQ1ZKLFFBQVEsT0FBTztFQUNiLFFBQVEsWUFBWSxXQUFXO0VBQy9CLE9BQU8sU0FBUyxTQUFTLGNBQWM7O0dBRXRDLFFBQVEsT0FBTyxNQUFNOztJQUVwQixNQUFNOztJQUVOLElBQUksU0FBUyxPQUFPO0tBQ25CLElBQUksUUFBUTtLQUNaLElBQUksUUFBUSxVQUFVLFFBQVE7O01BRTdCLE9BQU8sTUFBTSxZQUFZLE1BQU0sRUFBRSxPQUFPO1lBQ2xDOztNQUVOLE9BQU8sTUFBTSxZQUFZLE1BQU07Ozs7SUFJakMsZ0JBQWdCLFNBQVMsT0FBTztLQUMvQixJQUFJLFFBQVE7S0FDWixJQUFJLFFBQVEsVUFBVSxRQUFROztNQUU3QixPQUFPLE1BQU0sWUFBWSxtQkFBbUIsRUFBRSxPQUFPO1lBQy9DOztNQUVOLE9BQU8sTUFBTSxZQUFZLG1CQUFtQjs7Ozs7O0dBTS9DLEdBQUcsUUFBUSxVQUFVLGVBQWU7SUFDbkMsUUFBUSxPQUFPLEtBQUssTUFBTTs7OztJQUkxQjtBQ3JDSixRQUFRLE9BQU87RUFDYixRQUFRLGdCQUFnQixXQUFXO0VBQ25DLE9BQU8sU0FBUyxhQUFhLGtCQUFrQjs7R0FFOUMsUUFBUSxPQUFPLE1BQU07O0lBRXBCLE1BQU07O0lBRU4sSUFBSSxTQUFTLE9BQU87S0FDbkIsSUFBSSxRQUFRO0tBQ1osSUFBSSxRQUFRLFVBQVUsUUFBUTs7TUFFN0IsT0FBTyxNQUFNLFlBQVksTUFBTSxFQUFFLE9BQU87WUFDbEM7O01BRU4sT0FBTyxNQUFNLFlBQVksTUFBTTs7OztJQUlqQyxNQUFNLFNBQVMsT0FBTztLQUNyQixJQUFJLFFBQVE7S0FDWixJQUFJLFFBQVEsVUFBVSxRQUFROztNQUU3QixPQUFPLE1BQU0sWUFBWSxRQUFRLEVBQUUsT0FBTztZQUNwQzs7TUFFTixPQUFPLE1BQU0sWUFBWSxRQUFROzs7O0lBSW5DLE1BQU0sU0FBUyxPQUFPO0tBQ3JCLElBQUksUUFBUTtLQUNaLElBQUksUUFBUSxVQUFVLFFBQVE7O01BRTdCLE9BQU8sTUFBTSxZQUFZLFFBQVEsRUFBRSxPQUFPO1lBQ3BDOztNQUVOLE9BQU8sTUFBTSxZQUFZLFFBQVE7Ozs7SUFJbkMsVUFBVSxTQUFTLE9BQU87S0FDekIsSUFBSSxRQUFRO0tBQ1osSUFBSSxRQUFRLFVBQVUsUUFBUTs7TUFFN0IsT0FBTyxNQUFNLFlBQVksYUFBYSxFQUFFLE9BQU87WUFDekM7O01BRU4sT0FBTyxNQUFNLFlBQVksYUFBYTs7OztJQUl4QyxPQUFPLFNBQVMsT0FBTztLQUN0QixJQUFJLFFBQVE7S0FDWixJQUFJLFFBQVEsVUFBVSxRQUFROztNQUU3QixPQUFPLE1BQU0sWUFBWSxTQUFTLEVBQUUsT0FBTztZQUNyQzs7TUFFTixPQUFPLE1BQU0sWUFBWSxTQUFTOzs7O0lBSXBDLEtBQUssU0FBUyxPQUFPO0tBQ3BCLElBQUksUUFBUTtLQUNaLElBQUksUUFBUSxVQUFVLFFBQVE7O01BRTdCLE9BQU8sTUFBTSxZQUFZLE9BQU8sRUFBRSxPQUFPO1lBQ25DOztNQUVOLE9BQU8sTUFBTSxZQUFZLE9BQU87Ozs7OztHQU1uQyxHQUFHLFFBQVEsVUFBVSxtQkFBbUI7SUFDdkMsUUFBUSxPQUFPLEtBQUssTUFBTTs7OztJQUkxQjtBQ2pGSjtBQUNBLFFBQVEsT0FBTztFQUNiLFFBQVEsK0VBQW1CLFNBQVMsSUFBSSxPQUFPLGNBQWMsVUFBVSxjQUFjOztFQUVyRixJQUFJLG9CQUFvQjtFQUN4QixJQUFJLHNCQUFzQjtFQUMxQixJQUFJLGdCQUFnQixhQUFhO0VBQ2pDLElBQUksMEJBQTBCO0VBQzlCLElBQUksb0JBQW9CLGFBQWE7O0VBRXJDLElBQUksa0JBQWtCLFNBQVMsV0FBVyxTQUFTO0dBQ2xELElBQUksS0FBSztJQUNSLE9BQU87SUFDUCxXQUFXOztHQUVaLFFBQVEsUUFBUSxtQkFBbUIsU0FBUyxVQUFVO0lBQ3JELFNBQVM7Ozs7RUFJWCxJQUFJLG9CQUFvQixXQUFXO0dBQ2xDLE9BQU8sTUFBTSxJQUFJLEdBQUcsWUFBWSxvQ0FBb0MsS0FBSyxTQUFTLFVBQVU7SUFDM0YsU0FBUyxLQUFLLFFBQVEsU0FBUyxvQkFBb0I7S0FDbEQsWUFBWTs7SUFFYixzQkFBc0I7Ozs7RUFJeEIsSUFBSSxtQkFBbUIsV0FBVztHQUNqQyxHQUFHLHdCQUF3QixPQUFPO0lBQ2pDLE9BQU8sb0JBQW9CLEtBQUssV0FBVztLQUMxQyxPQUFPLGNBQWM7O1VBRWhCO0lBQ04sT0FBTyxHQUFHLEtBQUssY0FBYzs7OztFQUkvQixJQUFJLHdCQUF3QixXQUFXO0dBQ3RDLE9BQU8sTUFBTSxJQUFJLEdBQUcsWUFBWSx3Q0FBd0MsS0FBSyxTQUFTLFVBQVU7SUFDL0YsU0FBUyxLQUFLLFFBQVEsU0FBUyx3QkFBd0I7S0FDdEQsZ0JBQWdCOztJQUVqQiwwQkFBMEI7Ozs7RUFJNUIsSUFBSSx1QkFBdUIsV0FBVztHQUNyQyxHQUFHLDRCQUE0QixPQUFPO0lBQ3JDLE9BQU8sd0JBQXdCLEtBQUssV0FBVztLQUM5QyxPQUFPLGtCQUFrQjs7VUFFcEI7SUFDTixPQUFPLEdBQUcsS0FBSyxrQkFBa0I7Ozs7RUFJbkMsSUFBSSxjQUFjLFNBQVMsb0JBQW9CO0dBQzlDLElBQUksV0FBVyxJQUFJLFNBQVM7R0FDNUIsY0FBYyxJQUFJLFNBQVMsTUFBTTs7O0VBR2xDLElBQUksa0JBQWtCLFNBQVMsd0JBQXdCO0dBQ3RELElBQUksZUFBZSxJQUFJLGFBQWE7R0FDcEMsa0JBQWtCLElBQUksYUFBYSxNQUFNOzs7O0VBSTFDLElBQUksT0FBTyxTQUFTLFNBQVM7TUFDekIsT0FBTyxNQUFNLEtBQUssR0FBRyxZQUFZLCtCQUErQixLQUFLLFVBQVU7OztFQUduRixJQUFJLFVBQVUsU0FBUyxTQUFTO01BQzVCLE9BQU8sTUFBTSxLQUFLLEdBQUcsWUFBWSxrQ0FBa0MsS0FBSyxVQUFVOzs7RUFHdEYsT0FBTzs7R0FFTixpQkFBaUIsU0FBUyxXQUFXO0lBQ3BDLG1CQUFtQixLQUFLLFNBQVMsY0FBYztLQUM5QyxVQUFVLEtBQUs7Ozs7R0FJakIscUJBQXFCLFNBQVMsZUFBZTtJQUM1Qyx1QkFBdUIsS0FBSyxTQUFTLGtCQUFrQjtLQUN0RCxjQUFjLEtBQUs7Ozs7O0dBS3JCLGVBQWUsU0FBUyxNQUFNO0lBQzdCLElBQUksY0FBYztLQUNqQixNQUFNOztJQUVQLEtBQUssYUFBYSxLQUFLLFVBQVUsVUFBVTs7S0FFMUMsZ0JBQWdCLFlBQVk7OztLQUc1QixJQUFJLGlCQUFpQjtNQUNwQixJQUFJLFNBQVMsR0FBRzs7S0FFakIsUUFBUSxnQkFBZ0IsS0FBSyxVQUFVLFVBQVU7O01BRWhELGdCQUFnQixZQUFZOzs7OztHQUsvQixVQUFVLFNBQVMsVUFBVTtJQUM1QixrQkFBa0IsS0FBSzs7O0tBR3ZCO0FDbkhKLFFBQVEsT0FBTztFQUNiLE9BQU8sa0JBQWtCLFdBQVc7RUFDcEMsT0FBTyxTQUFTLE9BQU87R0FDdEIsSUFBSTtJQUNILElBQUksVUFBVSxhQUFhLFVBQVUsSUFBSTtLQUN4QyxPQUFPOztJQUVSLE9BQU8sTUFBTSxPQUFPOztHQUVyQixNQUFNLEtBQUs7SUFDVixPQUFPOzs7SUFHUDtBQ2JKLFFBQVEsT0FBTztFQUNiLE9BQU8sbUJBQW1CLFdBQVc7RUFDckMsT0FBTyxTQUFTLE9BQU87R0FDdEIsT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFLG1CQUFtQjs7SUFFbEQ7QUNMSixRQUFRLE9BQU87RUFDYixPQUFPLHFCQUFxQixXQUFXO0VBQ3ZDLE9BQU8sU0FBUyxPQUFPO0dBQ3RCLElBQUksT0FBTyxJQUFJLE9BQU8sVUFBVSxHQUFHO0lBQ2xDLFdBQVcsU0FBUyxRQUFRO0lBQzVCLE1BQU0sU0FBUyxNQUFNLE1BQU0sV0FBVztHQUN2QyxPQUFPLFNBQVMsTUFBTTs7SUFFckIiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnLCBbJ25nUm91dGUnLCAnYW5ndWxhci1jYWNoZSddKTtcclxuXHJcbmFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuXHJcblx0JHJvdXRlUHJvdmlkZXIud2hlbignLzpnaWQnLCB7XHJcblx0XHR0ZW1wbGF0ZTogJzxkb2N1bWVudGRldGFpbHM+PC9kb2N1bWVudGRldGFpbHM+J1xyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci53aGVuKCcvZG9jdW1lbnQvOmlkJywge1xyXG5cdFx0cmVkaXJlY3RUbzogZnVuY3Rpb24ocGFyYW1ldGVycykge1xyXG5cdFx0XHRyZXR1cm4gJy8nICsgdCgnZG9jdW1lbnRzJywgJ0FsbCBkb2N1bWVudHMnKSArICcvJyArIHBhcmFtZXRlcnMudWlkO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci53aGVuKCcvOmdpZC86aWQnLCB7XHJcblx0XHR0ZW1wbGF0ZTogJzxkb2N1bWVudGRldGFpbHM+PC9kb2N1bWVudGRldGFpbHM+J1xyXG5cdH0pO1xyXG5cclxuXHQkcm91dGVQcm92aWRlci5vdGhlcndpc2UoJy8nICsgdCgnZG9jdW1lbnRzJywgJ0FsbCBkb2N1bWVudHMnKSk7XHJcblxyXG59KTtcclxuXHJcbmFwcC5jb25maWcoWyckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xyXG5cdC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSovXHJcblx0JGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbi5yZXF1ZXN0dG9rZW4gPSBvY19yZXF1ZXN0dG9rZW47XHJcblx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UqL1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5jb250cm9sbGVyKCdmYWNldGxpc3RDdHJsJywgZnVuY3Rpb24oRG9jdW1lbnRTZXJ2aWNlKSB7XG5cdFx0dmFyIGN0cmwgPSB0aGlzO1xuXHRcdGN0cmwuZmFjZXRzID0gW107XG5cdFx0LyoqRG9jdW1lbnRTZXJ2aWNlLmdldEFsbChjdHJsLmZhY2V0cyk7XG5cdFx0RG9jdW1lbnRTZXJ2aWNlLnJlZ2lzdGVyKGZ1bmN0aW9uKGV2KSB7XG5cdFx0ICAgIGlmIChldi5ldmVudCA9PT0gJ2ltcG9ydGVkJykge1xuXHRcdCAgICAgICAgY3RybC5mYWNldHMucHVzaCguLi5ldi5kb2N1bWVudHMuZGF0YSk7XG5cdFx0XHR9XG5cdFx0fSk7KiovXG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZGlyZWN0aXZlKCdmYWNldGxpc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnZmFjZXRsaXN0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnZG9jdW1lbnRtYW5hZ2VyJywgJ3RlbXBsYXRlcy9uYXZpZ2F0aW9uL2ZhY2V0TGlzdC5odG1sJylcblx0XHR9O1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmNvbnRyb2xsZXIoJ2xvYWREb2N1bWVudHNCdXR0b25DdHJsJywgZnVuY3Rpb24oJGh0dHAsIERvY3VtZW50U2VydmljZSkge1xuXHRcdHZhciBjdHJsID0gdGhpcztcblx0XHRjdHJsLnQgPSB7XG5cdFx0XHRsb2FkRG9jdW1lbnRzIDogdCgnZG9jdW1lbnRtYW5hZ2VyJywgJ0xvYWQgZG9jdW1lbnQocyknKVxuXHRcdH07XG5cdFx0Y3RybC5sb2FkRG9jdW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGl0bGUgPSB0KCdkb2N1bWVudG1hbmFnZXInLCAnQ2hvb3NlIGRvY3VtZW50IHRvIGxvYWQgaW50byBEb2N1bWVudCBNYW5hZ2VyJyk7XG5cdFx0XHR2YXIgbWltZXR5cGVzID0gWydodHRwZC91bml4LWRpcmVjdG9yeScsICdhcHBsaWNhdGlvbi9wZGYnXTtcblx0XHQgICAgT0MuZGlhbG9ncy5maWxlcGlja2VyKHRpdGxlLCBfLmJpbmQodGhpcy5vbkNsb3VkRmlsZVNlbGVjdGVkLCB0aGlzKSwgZmFsc2UsIG1pbWV0eXBlcyk7XG5cdFx0fTtcblx0XHRjdHJsLm9uQ2xvdWRGaWxlU2VsZWN0ZWQgPSBmdW5jdGlvbihwYXRoKSB7XG5cdFx0XHREb2N1bWVudFNlcnZpY2UubG9hZERvY3VtZW50cyhwYXRoKTtcblx0XHR9O1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmRpcmVjdGl2ZSgnbG9hZGRvY3VtZW50c2J1dHRvbicsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJywgLy8gaGFzIHRvIGJlIGFuIGF0dHJpYnV0ZSB0byB3b3JrIHdpdGggY29yZSBjc3Ncblx0XHRcdHNjb3BlOiB7fSxcblx0XHRcdGNvbnRyb2xsZXI6ICdsb2FkRG9jdW1lbnRzQnV0dG9uQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnZG9jdW1lbnRtYW5hZ2VyJywgJ3RlbXBsYXRlcy9uYXZpZ2F0aW9uL2xvYWREb2N1bWVudHNCdXR0b24uaHRtbCcpXG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5jb250cm9sbGVyKCdvcmdhbmlzYXRpb25DdHJsJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdFx0Y3RybC5nZXRTZWxlY3RlZElkID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgcmV0dXJuIDE7XG5cdCAgICB9O1xuXG5cdFx0Y3RybC5pZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN0cmwub3JnYW5pc2F0aW9uLmlkKCk7XG5cdFx0fTtcblxuXHRcdGN0cmwubmFtZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN0cmwub3JnYW5pc2F0aW9uLm5hbWUoKTtcblx0XHR9O1xuXG5cdFx0Y3RybC5lbWFpbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN0cmwub3JnYW5pc2F0aW9uLmVtYWlsKCk7XG5cdFx0fTtcblxuXHRcdGN0cmwudXJsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gY3RybC5vcmdhbmlzYXRpb24udXJsKCk7XG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5kaXJlY3RpdmUoJ29yZ2FuaXNhdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzY29wZToge30sXG5cdFx0XHRjb250cm9sbGVyOiAnb3JnYW5pc2F0aW9uQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0b3JnYW5pc2F0aW9uOiAnPWRhdGEnXG5cdFx0XHR9LFxuXHRcdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnZG9jdW1lbnRtYW5hZ2VyJywgJ3RlbXBsYXRlcy9vcmdhbmlzYXRpb25saXN0L29yZ2FuaXNhdGlvbi5odG1sJylcblx0XHR9O1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmNvbnRyb2xsZXIoJ29yZ2FuaXNhdGlvbmxpc3RDdHJsJywgZnVuY3Rpb24oRG9jdW1lbnRTZXJ2aWNlKSB7XG5cdFx0dmFyIGN0cmwgPSB0aGlzO1xuXHRcdGN0cmwub3JnYW5pc2F0aW9ucyA9IFtdO1xuXHRcdERvY3VtZW50U2VydmljZS5yZWdpc3RlcihmdW5jdGlvbihldikge1xuXHRcdCAgICBpZiAoZXYuZXZlbnQgPT09ICdpbXBvcnRlZCcpIHtcblx0XHRcdFx0Ly8gVE9ETzogQmV0dGVyIG9ubHkgZ2V0IHRoZSBpbXBvcnRlZCBkb2N1bWVudHMgZnJvbSB0aGUgZXZlbnQuIG9yZyBsaXN0IGlzIG5vdCB5ZXQgdXBkYXRlZFxuXHRcdFx0XHREb2N1bWVudFNlcnZpY2UuZ2V0QWxsT3JnYW5pc2F0aW9ucyhjdHJsLm9yZ2FuaXNhdGlvbnMpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV2LmV2ZW50ID09PSAnaW1wb3J0ZWQnKSB7XG5cdFx0XHRcdC8vIFRPRE86IEJldHRlciBvbmx5IGdldCB0aGUgaW1wb3J0ZWQgZG9jdW1lbnRzIGZyb20gdGhlIGV2ZW50LiBvcmcgbGlzdCBpcyBub3QgeWV0IHVwZGF0ZWRcblx0XHRcdFx0RG9jdW1lbnRTZXJ2aWNlLmdldEFsbE9yZ2FuaXNhdGlvbnMoY3RybC5vcmdhbmlzYXRpb25zKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHREb2N1bWVudFNlcnZpY2UuZ2V0QWxsT3JnYW5pc2F0aW9ucyhjdHJsLm9yZ2FuaXNhdGlvbnMpO1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmRpcmVjdGl2ZSgnb3JnYW5pc2F0aW9ubGlzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJywgLy8gaGFzIHRvIGJlIGFuIGF0dHJpYnV0ZSB0byB3b3JrIHdpdGggY29yZSBjc3Ncblx0XHRcdHNjb3BlOiB7fSxcblx0XHRcdGNvbnRyb2xsZXI6ICdvcmdhbmlzYXRpb25saXN0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnZG9jdW1lbnRtYW5hZ2VyJywgJ3RlbXBsYXRlcy9mcmFnbWVudHMvb3JnYW5pc2F0aW9uTGlzdC5odG1sJylcblx0XHR9O1xuXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnZG9jdW1lbnRNYW5hZ2VyQXBwJylcblx0LmZhY3RvcnkoJ0RvY3VtZW50JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIERvY3VtZW50KGRvY3VtZW50RGF0YSkge1xuXG5cdFx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLCB7XG5cblx0XHRcdFx0ZGF0YToge30sXG5cblx0XHRcdFx0aWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIG1vZGVsID0gdGhpcztcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5zZXRQcm9wZXJ0eSgnaWQnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9kZWwuZ2V0UHJvcGVydHkoJ2lkJykudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdG9yZ2FuaXNhdGlvbklkOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdHZhciBtb2RlbCA9IHRoaXM7XG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9kZWwuc2V0UHJvcGVydHkoJ29yZ2FuaXNhdGlvbl9pZCcsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5nZXRQcm9wZXJ0eSgnb3JnYW5pc2F0aW9uX2lkJykudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdFx0XHRpZihhbmd1bGFyLmlzRGVmaW5lZChkb2N1bWVudERhdGEpKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZXh0ZW5kKHRoaXMuZGF0YSwgZG9jdW1lbnREYXRhKTtcblx0XHRcdH1cblxuXHRcdH07XG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZmFjdG9yeSgnT3JnYW5pc2F0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIE9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb25EYXRhKSB7XG5cblx0XHRcdGFuZ3VsYXIuZXh0ZW5kKHRoaXMsIHtcblxuXHRcdFx0XHRkYXRhOiB7fSxcblxuXHRcdFx0XHRpZDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzO1xuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdC8vIHNldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsLnNldFByb3BlcnR5KCdpZCcsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5nZXRQcm9wZXJ0eSgnaWQnKS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0bmFtZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzO1xuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdC8vIHNldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsLnNldFByb3BlcnR5KCduYW1lJywgeyB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGdldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsLmdldFByb3BlcnR5KCduYW1lJykudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGxvZ286IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIG1vZGVsID0gdGhpcztcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5zZXRQcm9wZXJ0eSgnbG9nbycsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5nZXRQcm9wZXJ0eSgnbG9nbycpLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRsb2dvRGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzO1xuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdC8vIHNldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsLnNldFByb3BlcnR5KCdsb2dvX2RhdGUnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9kZWwuZ2V0UHJvcGVydHkoJ2xvZ29fZGF0ZScpLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRlbWFpbDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzO1xuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdC8vIHNldHRlclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsLnNldFByb3BlcnR5KCdlbWFpbCcsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5nZXRQcm9wZXJ0eSgnZW1haWwnKS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0dXJsOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRcdHZhciBtb2RlbCA9IHRoaXM7XG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9kZWwuc2V0UHJvcGVydHkoJ3VybCcsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbC5nZXRQcm9wZXJ0eSgndXJsJykudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdFx0XHRpZihhbmd1bGFyLmlzRGVmaW5lZChvcmdhbmlzYXRpb25EYXRhKSkge1xuXHRcdFx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLmRhdGEsIG9yZ2FuaXNhdGlvbkRhdGEpO1xuXHRcdFx0fVxuXG5cdFx0fTtcblx0fSk7IiwiLypnbG9iYWxzIE9DIGFuZ3VsYXIqL1xuYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXHJcblx0LmZhY3RvcnkoJ0RvY3VtZW50U2VydmljZScsIGZ1bmN0aW9uKCRxLCAkaHR0cCwgT3JnYW5pc2F0aW9uLCBEb2N1bWVudCwgQ2FjaGVGYWN0b3J5KSB7XHJcblxyXG5cdFx0dmFyIG9ic2VydmVyQ2FsbGJhY2tzID0gW107XG5cdFx0dmFyIGRvY3VtZW50Q2FjaGVGaWxsZWQgPSBmYWxzZTtcblx0XHR2YXIgZG9jdW1lbnRDYWNoZSA9IENhY2hlRmFjdG9yeSgnZG9jdW1lbnRzJyk7XG5cdFx0dmFyIG9yZ2FuaXNhdGlvbkNhY2hlRmlsbGVkID0gZmFsc2U7XG5cdFx0dmFyIG9yZ2FuaXNhdGlvbkNhY2hlID0gQ2FjaGVGYWN0b3J5KCdvcmdhbmlzYXRpb24nKTtcclxuXHJcblx0XHR2YXIgbm90aWZ5T2JzZXJ2ZXJzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBwYXlsb2FkKSB7XHJcblx0XHRcdHZhciBldiA9IHtcclxuXHRcdFx0XHRldmVudDogZXZlbnROYW1lLFxyXG5cdFx0XHRcdGRvY3VtZW50czogcGF5bG9hZFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2gob2JzZXJ2ZXJDYWxsYmFja3MsIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXYpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxuXHRcdHZhciBmaWxsRG9jdW1lbnRDYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChPQy5nZW5lcmF0ZVVybCgnL2FwcHMvZG9jdW1lbnRtYW5hZ2VyL2RvY3VtZW50cycpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdHJlc3BvbnNlLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2N1bWVudFByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRhZGREb2N1bWVudChkb2N1bWVudFByb3BlcnRpZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZG9jdW1lbnRDYWNoZUZpbGxlZCA9IHRydWU7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dmFyIGxvYWRBbGxEb2N1bWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmKGRvY3VtZW50Q2FjaGVGaWxsZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHJldHVybiBmaWxsRG9jdW1lbnRDYWNoZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRvY3VtZW50Q2FjaGUudmFsdWVzKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICRxLndoZW4oZG9jdW1lbnRDYWNoZS52YWx1ZXMoKSk7XG5cdFx0XHR9XHJcblx0XHR9O1xuXG5cdFx0dmFyIGZpbGxPcmdhbmlzYXRpb25DYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChPQy5nZW5lcmF0ZVVybCgnL2FwcHMvZG9jdW1lbnRtYW5hZ2VyL29yZ2FuaXNhdGlvbnMnKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRyZXNwb25zZS5kYXRhLmZvckVhY2goZnVuY3Rpb24ob3JnYW5pc2F0aW9uUHJvcGVydGllcykge1xuXHRcdFx0XHRcdGFkZE9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb25Qcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdG9yZ2FuaXNhdGlvbkNhY2hlRmlsbGVkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR2YXIgbG9hZEFsbE9yZ2FuaXNhdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmKG9yZ2FuaXNhdGlvbkNhY2hlRmlsbGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXR1cm4gZmlsbE9yZ2FuaXNhdGlvbkNhY2hlKCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3JnYW5pc2F0aW9uQ2FjaGUudmFsdWVzKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICRxLndoZW4ob3JnYW5pc2F0aW9uQ2FjaGUudmFsdWVzKCkpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR2YXIgYWRkRG9jdW1lbnQgPSBmdW5jdGlvbihkb2N1bWVudFByb3BlcnRpZXMpIHtcblx0XHRcdHZhciBkb2N1bWVudCA9IG5ldyBEb2N1bWVudChkb2N1bWVudFByb3BlcnRpZXMpO1xuXHRcdFx0ZG9jdW1lbnRDYWNoZS5wdXQoZG9jdW1lbnQuaWQoKSwgZG9jdW1lbnQpO1xuXHRcdH07XHJcblxuXHRcdHZhciBhZGRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbihvcmdhbmlzYXRpb25Qcm9wZXJ0aWVzKSB7XG5cdFx0XHR2YXIgb3JnYW5pc2F0aW9uID0gbmV3IE9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb25Qcm9wZXJ0aWVzKTtcblx0XHRcdG9yZ2FuaXNhdGlvbkNhY2hlLnB1dChvcmdhbmlzYXRpb24uaWQoKSwgb3JnYW5pc2F0aW9uKTtcblx0XHR9O1xuXG5cdFx0Ly8gVE9ETzogRG8gbm90IHJldHVybiBodHRwIHJlc3BvbnNlIGJ1dCBhZGQgZG9jdW1lbnRzIGFuZCBvcmdhbmlzYXRpb25zIHRvIGNhY2hlIGFuZCByZXR1cm4gYm90aDsgU2VydmVyIGFsc28gbmVlZHMgdG8gcmV0dXJuIGJvdGhcclxuXHRcdHZhciBsb2FkID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG5cdFx0ICAgIHJldHVybiAkaHR0cC5wb3N0KE9DLmdlbmVyYXRlVXJsKCcvYXBwcy9kb2N1bWVudG1hbmFnZXIvbG9hZCcpLCBKU09OLnN0cmluZ2lmeShyZXF1ZXN0KSk7XHJcblx0XHR9O1xuXG5cdFx0dmFyIGFuYWx5emUgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG5cdFx0ICAgIHJldHVybiAkaHR0cC5wb3N0KE9DLmdlbmVyYXRlVXJsKCcvYXBwcy9kb2N1bWVudG1hbmFnZXIvYW5hbHl6ZScpLCBKU09OLnN0cmluZ2lmeShyZXF1ZXN0KSk7XG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xuXHJcblx0XHRcdGdldEFsbERvY3VtZW50czogZnVuY3Rpb24oZG9jdW1lbnRzKSB7XHJcblx0XHRcdFx0bG9hZEFsbERvY3VtZW50cygpLnRoZW4oZnVuY3Rpb24oZG9jdW1lbnRMaXN0KSB7XHJcblx0XHRcdFx0XHRkb2N1bWVudHMucHVzaCguLi5kb2N1bWVudExpc3QpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxuXHJcblx0XHRcdGdldEFsbE9yZ2FuaXNhdGlvbnM6IGZ1bmN0aW9uKG9yZ2FuaXNhdGlvbnMpIHtcclxuXHRcdFx0XHRsb2FkQWxsT3JnYW5pc2F0aW9ucygpLnRoZW4oZnVuY3Rpb24ob3JnYW5pc2F0aW9uTGlzdCkge1xuXHRcdFx0XHRcdG9yZ2FuaXNhdGlvbnMucHVzaCguLi5vcmdhbmlzYXRpb25MaXN0KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcblxuXHRcdFx0Ly8gVE9ETzogUmV0dXJuIG5ldyBEb2N1bWVudCBhbmQgT3JnYW5pc2F0aW9uIG9iamVjdHMgaW4gc2VwYXJhdGUgZXZlbnRzXHJcblx0XHRcdGxvYWREb2N1bWVudHM6IGZ1bmN0aW9uKHBhdGgpIHtcblx0XHRcdFx0dmFyIGxvYWRyZXF1ZXN0ID0ge1xyXG5cdFx0XHRcdFx0cGF0aDogcGF0aFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0bG9hZChsb2FkcmVxdWVzdCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0XHQvLyBUT0RPOiBBZGQgbG9hZGVkIGRvY3VtZW50cyB0byBjYWNoZVxuXHRcdFx0XHRcdG5vdGlmeU9ic2VydmVycygnaW1wb3J0ZWQnLCByZXNwb25zZSk7XG5cblx0XHRcdFx0XHQvLyBUT0RPOiBFeHRlbmQgQVBJIHRvIHRha2UgbW9yZSB0aGFuIG9uZSBrZXkgYXQgYSB0aW1lXG5cdFx0XHRcdFx0dmFyIGFuYWx5emVSZXF1ZXN0ID0ge1xuXHRcdFx0XHRcdFx0aWQ6IHJlc3BvbnNlWzBdWydpZCddXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRhbmFseXplKGFuYWx5emVSZXF1ZXN0KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETzogVXBkYXRlIGRvY3VtZW50cyBpbiBjYWNoZVxuXHRcdFx0XHRcdFx0bm90aWZ5T2JzZXJ2ZXJzKCdhbmFseXplZCcsIHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXG5cclxuXHRcdFx0cmVnaXN0ZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdFx0b2JzZXJ2ZXJDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXHJcblx0LmZpbHRlcignZmlyc3RDaGFyYWN0ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkIHx8IGlucHV0ID09PSAnJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuICcwJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGlucHV0LmNoYXJBdCgwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdkb2N1bWVudE1hbmFnZXJBcHAnKVxuXHQuZmlsdGVyKCduZXdPcmdhbmlzYXRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcblx0XHRcdHJldHVybiBpbnB1dCAhPT0gJycgPyBpbnB1dCA6IHQoJ2RvY3VtZW50bWFuYWdlcicsICdOZXcgb3JnYW5pc2F0aW9uJyk7XG5cdFx0fTtcblx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ2RvY3VtZW50TWFuYWdlckFwcCcpXG5cdC5maWx0ZXIoJ29yZ2FuaXNhdGlvbkNvbG9yJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0XHR2YXIgaGFzaCA9IG1kNShpbnB1dCkuc3Vic3RyaW5nKDAsIDQpLFxuXHRcdFx0XHRtYXhSYW5nZSA9IHBhcnNlSW50KCdmZmZmJywgMTYpLFxuXHRcdFx0XHRodWUgPSBwYXJzZUludChoYXNoLCAxNikgLyBtYXhSYW5nZSAqIDI1Njtcblx0XHRcdHJldHVybiAnaHNsKCcgKyBodWUgKyAnLCA5MCUsIDY1JSknO1xuXHRcdH07XG5cdH0pOyJdfQ==
