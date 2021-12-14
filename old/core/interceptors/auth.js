(function (angular) {
	"use strict";

	//For the $api service
	angular.module("lt.core").config(["$httpProvider", function ($httpProvider) {
		$httpProvider.interceptors.push([
			"$injector",
			function ($injector) {
				return $injector.get("AuthInterceptor");
			}
		]);
	}]).factory("AuthInterceptor", ["$rootScope", "$q", "AUTH_EVENTS", function ($rootScope, $q, AUTH_EVENTS) {
		return {
			responseError: function (response) { 
				$rootScope.$broadcast({
					401: AUTH_EVENTS.notAuthenticated,
					403: AUTH_EVENTS.notAuthorized,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout
				}[response.status], response);
				return $q.reject(response);
			}
		};
	}]);

})(window.angular);