/*globals OC angular*/
angular.module('documentManagerApp')
	.factory('DocumentService', function($http, Organisation) {

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
	});