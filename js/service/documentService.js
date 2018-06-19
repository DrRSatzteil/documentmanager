angular.module('documentManagerApp')
.factory('DocumentService', function($http) {
	
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
		loadDocuments: function(path) {
		    var request = {
                path: path,
            }
		    load(request).then(function (response){
		        notifyObservers('imported', response);
		    },
	        function (error) {
	            alert (JSON.stringify(error));
	        });
		},
		register: function(callback) {
		    observerCallbacks.push(callback);
		}
	};
});
