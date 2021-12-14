(function (angular, _) {
	"use strict";

	angular.module("lt.core").directive("optionsDirective", [function () {
		return {
			restrict:"E",
			templateUrl: "components/accordion/options/index.html",
			scope:{
				step:"=",
				option: "="
			},
			link: function ($scope) {

				function init () {
					defineScope();
					defineListeners();
				}

				function defineScope () {
					$scope.select = select;
					$scope.back = back;
				}

				function defineListeners () {

				}

				function select (opt) {
					//get image url or cue.imgs

					$scope.$emit("addCue", {
						prompt:opt.prompt,
						file_id:opt.img,
						imgs:opt.img
					});
					$scope.step = 0;
				}

				function back () {
					$scope.step = 0;
				}

				init();
			}
		};
	}]);
})(window.angular, window._);
