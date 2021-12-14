(function (angular) {
	"use strict";
	
	angular.module("lt.core").directive("pageTitle", ["$http", "$state", function ($http, $state) { 
		return {
			restrict: "A",
			templateUrl: "components/page-title/index.html",
			scope : {
				title:"@pageTitle"
			},
			link: function ($scope) {

				function init () {
					// Do something
					$scope.isLoading = isLoading;
					$scope.showBackButton = showBackButton;
				}

				function isLoading () {
					return $http.pendingRequests.length > 0;
				}

				function showBackButton () {
					return !$state.is("root.company.dashboard");
				}

				init();
			}
		};
	}]);
})(window.angular);