angular.module("lt.core").directive("reportCard", [function () {
	"use strict";

	return {
		restrict: "A",
		templateUrl: "components/report-card/index.html",
		scope : {
			model:"=reportCard",
		},
		link: function ($scope) {
			function init () {

			}

			init();
		}
	};
}]);
