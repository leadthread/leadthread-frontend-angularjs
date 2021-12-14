(function (angular) {
	"use strict";

	angular.module("lt.core").run(["AUTH_EVENTS", "$auth", "$rootScope", "$notification", "$localStorage", function (AUTH_EVENTS, $auth, $rootScope, $notification, $localStorage) {
		
		function goHome () {
			$auth.goHome();
		}

		function goToLoginPage () {
			$auth.logout();
		}

		function handleNotAuthenticated () {
			$notification.error("Please Log In");
			$localStorage.clear();
			goToLoginPage();
		}

		function handleNotAuthorized () {
			$notification.error("You cannot access that");
			goHome();
		}

		function handleSessionTimeout () {
			$notification.error("Please Log In");
			$localStorage.clear();
			goToLoginPage();
		}

		$rootScope.$on(AUTH_EVENTS.notAuthenticated, handleNotAuthenticated);
		$rootScope.$on(AUTH_EVENTS.notAuthorized, handleNotAuthorized);
		$rootScope.$on(AUTH_EVENTS.sessionTimeout, handleSessionTimeout);
	}]);

})(window.angular);