(function () {
	"use strict";

	angular.module("lt.core").factory("TimeoutInterceptor", ["$q", function ($q) {
		return {
			responseError: function (response) {
				if (response.status === -1) {
					console.warn("Request... CANCELLED! (It timed out or could not connect to the internet)");
				}
				return $q.reject(response);
			}
		};
	}]);

	angular.module("lt.core").config(["$httpProvider", function ($httpProvider) {
		$httpProvider.interceptors.push("TimeoutInterceptor");
	}]);

})();