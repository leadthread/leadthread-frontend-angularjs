(function (angular) {
	"use strict";

	angular.module("lt.core").factory("404Intercepter", ["$q", "$notification", function ($q, $notification) {
		return {
			responseError: function (response) {
				if (response.status === 404) {
					$notification.error(_.get(response, "data.error.message", "404: Not Found"));
				}
				return $q.reject(response);
			}
		};
	}]);

	angular.module("lt.core").config(["$httpProvider", function ($httpProvider) {
		$httpProvider.interceptors.push("404Intercepter");
	}]);

})(window.angular);