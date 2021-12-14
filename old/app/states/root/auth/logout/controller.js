angular.module('lt.app').controller('LogoutController', ["$scope", "$auth", function($scope, $auth){
	function init () {
		$auth.logout();
	}

	init();
}]);