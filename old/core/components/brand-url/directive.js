(function (angular, _) {
	"use strict";
	
	angular.module("lt.core").directive("brandUrl", ["$api", function ($api) { 
		return {
			restrict: "A",
			templateUrl: "components/brand-url/index.html",
			scope : {
				company:"=brandUrl"
			},
			link: function ($scope) {
				
				function init () { 
					$scope.url_display = $scope.company.url.replace(/https?:\/\//, "");
				}

				init();
			}
		};
	}]);
})(window.angular, window._);