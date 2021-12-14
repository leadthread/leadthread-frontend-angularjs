(function (angular) {
	"use strict";

	angular.module("lt.core").directive("sectionSocialPreview", ["$placeholder", function ($placeholder) { 
		return {
			restrict: "AE",
			templateUrl: "components/section/social-preview/index.html",
			scope : {
				model:"=sectionSocialPreview",
			},
			link: function ($scope) {
				
				function init () {
					$scope.date = new Date();
					$scope.parse = parse;
				}

				function parse (str) {
					return $placeholder.parse(str);
				}

				init();
			}
		};
	}]);
})(window.angular);