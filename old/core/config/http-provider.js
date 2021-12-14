(function (angular) {
	"use strict";

	angular.module("lt.core").config(["$httpProvider", function ($httpProvider) {
		$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
		$httpProvider.defaults.xsrfHeaderName = "X-CSRF-TOKEN";
	}]);
	
})(window.angular);