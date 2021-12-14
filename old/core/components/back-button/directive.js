angular.module("lt.core").directive("backButton", ["$window", function ($window) { 
	"use strict";

	return {
		restrict: "EA",
		templateUrl: "components/back-button/index.html",
		// transclude: true,
		scope : {
			icon: "@"
		},
		link: function ($scope) {
			
			function init () { 
				$scope.icon = $scope.icon === "true";
				$scope.onClick = onClick;
			}

			function onClick () {
				$window.history.back();
			}

			init();
		}
	};
}]);
