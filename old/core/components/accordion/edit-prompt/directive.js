(function (angular, _) {
	"use strict";

	angular.module("lt.core").directive("editPromptDirective", ["$notification", "$api", function ($notification, $api) {
		return {
			restrict:"EA",
			templateUrl: "components/accordion/edit-prompt/index.html",
			scope:{
				cue: "=",
				showbtn: "=",
				index: "="
			},
			link: function ($scope) {

				function init () {
					defineScope();
					defineListeners();
				}

				function defineScope () {
					$scope.cueUp = cueUp;
					$scope.cueDown = cueDown;
					$scope.deleteCue = deleteCue;
					$scope.addCue = addCue;
					if (_.isEmpty($scope.cue.prompt)) {
						$scope.cue.prompt = "";
					}
					$scope.back = back;
					$scope.stopProp = stopProp;
				}

				function stopProp ($event) {
					$event.stopPropagation();
				}

				function defineListeners () {
					$scope.$watch(function () {
						return JSON.stringify($scope.img);
					}, function (n) {
						if (n && !_.isEmpty($scope.img)) {
							$scope.cue.file_id = $scope.img.id;
							$scope.cue.image = "/files/"+$scope.img.fingerprint+"/thumb/480";
						}
					});
				}

				function back () {
					$scope.$emit("back");
				}

				function addCue () {
					if ($scope.cue.prompt != null && $scope.cue.prompt != "") {
						$scope.$emit("addCue", $scope.cue);
					} else {
						$notification.error("Prompt Must Not Be Empty.");
					}
				}

				function cueUp () {
					$scope.$emit("cueUp", $scope.cue);
				}

				function cueDown () {
					$scope.$emit("cueDown", $scope.cue);
				}

				function deleteCue () {
					$scope.$emit("deleteCue", $scope.cue);
				}

				init();
			}
		};
	}]);
})(window.angular, window._);
