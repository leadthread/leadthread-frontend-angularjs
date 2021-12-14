/* global angular:false, _:false */
angular.module("lt.core").factory("$color", [function () {
	"use strict";

	var map = function (value, in_min, in_max, out_min, out_max) {
		return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	};

	var hsl = function (h, s, l) {
		return "hsl(" + [h, s, l].join(", ") + ")";
	};

	var rgb = function (r, g, b) {
		return "rgb(" + [r, g, b].join(", ") + ")";
	};

	var getStringValue = function (string) {
		return Math.round(map((parseInt(string.toLowerCase().charCodeAt(0))-97) % 26, 0, 25, 0, 100));
	};

	var stringToHue = function (string) {
		return Math.round(map(getStringValue(string), 0, 100, 0, 255));
	};

	var stringToHsl = function (string) {
		return hsl(stringToHue(string), "51%", "59%");
	};

	return {
		stringToHsl: stringToHsl,
		stringToHue: stringToHue,
		rgb: rgb,
		hsl: hsl,
	};
}]);