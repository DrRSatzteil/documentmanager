/*globals OC angular*/
angular.module('documentManagerApp')
	.factory('DocumentService', function($q, $http, Organisation, NextcloudDocument, CacheFactory) {

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
	});