(function (angular, _) {
	"use strict";
	
	angular.module("lt.app").controller("StartController", ["$scope", "$stateParams", "$auth", "$notification", "$state", "$http", function ($scope, $stateParams, $auth, $notification, $state, $http) {
		function init () {
			if ($stateParams.link_id === undefined) {
				defineScope();
				defineListeners();
			} else {
				login();
			}
		}

		function login () {
			var code = $stateParams.code;
			$auth.loginWithInviteCode(code).then(function (resp) {
				resp = resp;
				$state.go("root.campaign", {campaignId: resp.code.campaign_id});
			}, function (error) {
				$state.go("root.auth.code");
			});
		}

		function defineScope () {
			$scope.showForm = true;
		}

		function defineListeners () {
			
		}

		init();
	}]);
})(window.angular, window._);