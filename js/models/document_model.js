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