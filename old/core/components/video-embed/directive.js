(function (angular, _) {
	"use strict";

	angular.module("lt.core").directive("videoEmbed", ["$socket", function ($socket) {
		return {
			restrict: "EA",
			templateUrl: "components/video-embed/index.html",
			scope : {
				"model":"=videoEmbed",
				"loadVideo":"=?",
				"onPlayed": "&",
				"onPaused": "&",
				"onEnded": "&",
				"onReady": "&",
				"onBuffering": "&",
			},

			link: function ($scope) {
				
				function init () {
					defineScope();
					defineListeners();
				}

				function defineScope () {
					if ($scope.loadVideo !== false) {
						$scope.loadVideo = true;
					}
				}

				function defineListeners () {
					$scope.$on("App\\Events\\VideoUpdated", function (event, data) {
						if (data.model.id === $scope.model.id) {
							$scope.$apply(function () {
								$scope.model = data.model;
							});		
						}
					});

					$scope.$on("App\\Events\\VideoError", function (event, data) {
						if (data.model.id === $scope.model.id) {
							$scope.$apply(function () {
								$scope.model = data.model;
								$scope.hasError = true;
								$scope.error = data.error;
							});
						}
					});

					$scope.$watch(function () {
						return ($scope.model ? $scope.model.id : null);
					}, function (n, o) {
						$scope.hasError = $scope.model === null ? false : $scope.model.status === "error";
						if (n!==o) {
							unsubscribe(o);
						}
						subscribe(n);
					});

					$scope.$on("$destroy", function () {
						unsubscribe($scope.model.id);
					});
					
				}

				function subscribe (id) {
					if (_.isInteger(id)) {
						$socket.subscribe("video."+id);
					}
				}

				function unsubscribe (id) {
					if (_.isInteger(id)) {
						$socket.unsubscribe("video."+id);
					}
				}
				
				init();
			}
		};
	}]);
})(window.angular, window._);