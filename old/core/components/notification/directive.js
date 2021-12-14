(function (angular) {
	"use strict";

	angular.module("lt.core").directive("notificationOverlay", ["$notification", function ($notification) {
		return {
			restrict: "EA",
			templateUrl: "components/notification/index.html",
			link: function ($scope) {
				var init = function () {
					defineScope();
					defineListeners();
				};

				var defineScope = function () {
					$scope.notifications = [];
					$scope.notifications = $notification.notifications;
					$scope.clear = clear;
				};

				var clear = function (index) {
					$notification.clear(index);
				};

				var defineListeners = function () {
				};

				init();
			}
		};
	}]);
})(window.angular);