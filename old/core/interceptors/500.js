(function (angular) {
	"use strict";

	angular.module("lt.core").factory("500Intercepter", ["$q", "$notification", function ($q, $notification) {
		return {
			responseError: function (response) {
				if (response.status >= 500 && response.status < 600) {
					$notification.error(_.get(response, "data.error.message", "Server Error"));
				}
				return $q.reject(response);
			}
		};
	}]);

	angular.module("lt.core").config(["$httpProvider", function ($httpProvider) {
		$httpProvider.interceptors.push("500Intercepter");
	}]);

})(window.angular);