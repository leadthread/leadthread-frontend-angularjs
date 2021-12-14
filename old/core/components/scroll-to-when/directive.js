angular.module("lt.core").directive("scrollToWhen", [function () { 
	"use strict";

	return {
		restrict: "A",
		scope : {
			trigger: "=scrollToWhen"
		},
		link: function ($scope, $el) {
			
			/**
			 * Start it up
			 */
			function init () { 
				$scope.$watch("trigger", function (n, o) {
					if(n !== o && !!n) {
						$('html, body').stop().animate({
							scrollTop: $el.offset().top - 80
						}, 200);
					}
				});
			}

			init();
		}
	};
}]);