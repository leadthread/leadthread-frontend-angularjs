angular.module("lt.core").directive("scrollToTopWhen", [function () { 
	"use strict";

	return {
		restrict: "A",
		scope : {
			trigger: "=scrollToTopWhen"
		},
		link: function ($scope, $el) {
			
			/**
			 * Start it up
			 */
			function init () { 
				$scope.$watch("trigger", function () {
					$el[0].scrollTop = 0;
				});
			}

			init();
		}
	};
}]);