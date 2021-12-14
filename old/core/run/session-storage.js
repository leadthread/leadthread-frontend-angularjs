(function (angular) {
	"use strict";

	angular.module("lt.core").run(["$sessionStorage", function ($sessionStorage) {
		$sessionStorage.clear();
	}]);

})(window.angular);