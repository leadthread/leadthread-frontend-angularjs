(function (angular) {
	"use strict";

	angular.module("lt.app").controller("AuthResetController", ["$scope", "$http", "$notification", function ($scope, $http, $notification) {
		function init () {
			$scope.reset = reset;
		}

		function reset () {
			$http.post("/password/email", $scope.$parent.credentials).then(function (resp) {
				$notification.success("An email with instructions has been sent to that email address.");
				$scope.$parent.credentials = {};
			});
		}

		init();
	}]);
})(window.angular);