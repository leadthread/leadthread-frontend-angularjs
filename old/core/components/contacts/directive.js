angular.module("lt.core").directive("contacts", ["$q", "$cache", "$api", "$http", function ($q, $cache, $api, $http) {
	"use strict";

	return {
		restrict: "E",
		templateUrl: "components/contacts/index.html",
	};
}]);