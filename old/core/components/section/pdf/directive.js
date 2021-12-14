(function (angular) {
	"use strict";

	angular.module("lt.core").directive("sectionPdf", [function () { 
		return {
			restrict: "A",
			templateUrl: "components/section/pdf/index.html",
			scope : {
				model:"=sectionPdf",
			},
			link: function ($scope) {
				
				function init () {
				}

				init();
			}
		};
	}]);
})(window.angular);