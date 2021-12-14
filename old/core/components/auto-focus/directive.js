/**
 * https://gist.github.com/mlynch/dd407b93ed288d499778
 *
 * the HTML5 autofocus property can be finicky when it comes to dynamically
 * loaded templates and such with AngularJS. Use this simple directive to tame
 * this beast once and for all.
 *
 * Usage:
 * <input type="text" auto-focus>
 */
(function (angular) {
	"use strict";

	angular.module("lt.core").directive("autoFocus", ["$timeout", "$parse",
		function ($timeout, $parse) {
			return {
				restrict: "A",
				link: function ($scope, $element, $attr) {
					var enabled = $parse($attr.autoFocus)($scope);
					if (enabled === true || $attr.autoFocus === "") {
						$timeout(function () {
							$element[0].focus();
						}, 100);
					}
				}
			};
		}
	]);
})(window.angular);