(function (angular) {
	"use strict";

	angular.module("lt.core").run(["$rootScope", "$device", function ($rootScope, $device) {
		$rootScope.windowWidth = $device.width;
		$rootScope.$watch(function () {
			return $device.width;
		}, function (n) {
			$rootScope.windowWidth = n;
		});
	}]);

})(window.angular);