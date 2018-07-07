/*globals OC angular*/
angular.module('documentManagerApp')
	.factory('DocumentService', function($q, $http, Organisation, Document, CacheFactory) {

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
			var doc = new Document(documentProperties);
			documentCache.put(doc.id(), doc);
		};

		var addOrganisation = function(organisationProperties) {
			var organisation = new Organisation(organisationProperties);
			organisationCache.put(organisation.id(), organisation);
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
	});