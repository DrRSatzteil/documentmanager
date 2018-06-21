angular.module('documentManagerApp')
	.filter('organisationColor', function() {
		return function(input) {
			var hash = md5(input).substring(0, 4),
				maxRange = parseInt('ffff', 16),
				hue = parseInt(hash, 16) / maxRange * 256;
			return 'hsl(' + hue + ', 90%, 65%)';
		};
	});