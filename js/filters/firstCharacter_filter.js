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