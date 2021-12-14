angular.module("lt.core").filter("readableTime", function () {
	"use strict";

	return function (input) {
		return moment(input, "HH:mm:ssZZ").format("hh:mm A");
	};
});
