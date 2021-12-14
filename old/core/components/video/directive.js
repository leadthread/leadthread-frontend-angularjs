(function (angular, _) {
	"use strict";
	angular.module("lt.core").directive("video", [function () { 
		return {
			restrict: "A",
			templateUrl: "components/video/index.html",
			scope : {
				videoId:"=",
				videoType:"="
			},
			link: function ($scope) {
				
				function init () {
					$scope.videoType = $scope.videoType ? $scope.videoType : "youtube";

					if (_.isEmpty($scope.videoId)) {
						throw "$scope.videoId cannot be empty!";
					}
				}

				init();
			}
		};
	}]);
})(window.angular, window._);