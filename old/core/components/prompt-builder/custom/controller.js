/* global angular:false, _:false */

angular.module("lt.core").controller("PromptBuilderCustomController", ["$scope", "Prompt", "$uibModalInstance", function ($scope, Prompt, $uibModalInstance) {
	"use strict";

	function init () {
		defineScope();
		defineListeners();
	}

	function defineScope () {
		$scope.prompt = new Prompt();
	}

	function defineListeners () {
	}

	$scope.done = function () {
		$uibModalInstance.close($scope.prompt);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss("cancel");
	};

	init();
}]);