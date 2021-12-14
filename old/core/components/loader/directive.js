(function (angular) {
	"use strict";

	angular.module("lt.core").directive("loader", [function () { 
		return {
			restrict: "A",
			templateUrl: "components/loader/index.html",
			scope : {
				text: "@loader",
				white: "=",
			},
			link: function () {

				function init () {
				// Do something
				}

				init();
			}
		};
	}]);
})(window.angular);