angular.module("lt.core").config(["$qProvider", function ($qProvider) {
	"use strict";
	
	$qProvider.errorOnUnhandledRejections(true);
}]);