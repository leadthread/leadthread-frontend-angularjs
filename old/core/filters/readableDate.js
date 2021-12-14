angular.module("lt.core").filter("readableDate", function () {
	"use strict";

	return function (input) {
		return moment(input).calendar(moment(), {
			sameElse: "MM/DD/YYYY h:mm:ss A"
		});     
	};
});
