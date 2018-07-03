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