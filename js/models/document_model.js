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