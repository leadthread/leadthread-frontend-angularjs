(function (angular, _) {
	"use strict";
	
	angular.module("lt.core").directive("inputRadio", ["$api", function ($api) { 
		return {
			restrict: "EA",
			templateUrl: "components/input-radio/index.html",
			scope : {
				model: "=ngModel",
				change: "=",
				value: "=",
				text: "@",
				name: "@",
				required: "=ngRequired"
			},
			link: function ($scope) {
				
				function init () {
				}

				init();
			}
		};
	}]);
})(window.angular, window._);