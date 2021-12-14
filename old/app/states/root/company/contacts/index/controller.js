angular.module("lt.app").controller("ContactsIndexController", ["$scope", "$http", "company_id", "$api", "$cache", "users", "$notification", "$stateParams", "$location", "$state", "$device", "role", function ($scope, $http, company_id, $api, $cache, users, $notification, $stateParams, $location, $state, $device, role) {
	"use strict";

	function init () {
		defineScope();
		defineListeners();
	}

	function defineScope () {
		$scope.opts = {};
		$scope.users = users;
		$scope.role = role;
		$scope.selected = [];

		if ($stateParams.userId) {
			$scope.opts.user_id = parseInt($stateParams.userId);
		}
	}

	function defineListeners () {
		$scope.$watch(function () {
			return $scope.opts.user_id;
		}, function () {
			$location.search("userId", $scope.opts.user_id);
		});
	}

	init();
}]);