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