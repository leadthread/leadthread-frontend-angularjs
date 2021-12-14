angular.module("lt.core").filter("kebabCase", function () {
	"use strict";

	return function (input) {
		if (_.isString(input)) {
			return input.replace(/[\s_]/g, "-").toLowerCase();
		} else {
			return input;
		}
	};
});
