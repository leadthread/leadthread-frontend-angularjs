(function (angular) {
	"use strict";

	angular.module("lt.core").directive("sectionSpacer", ["$placeholder", function ($placeholder) { 
		return {
			restrict: "A",
			templateUrl: "components/section/spacer/index.html",
			scope : {
				model:"=sectionSpacer",
			},
			link: function ($scope) {
				
				function init () {
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