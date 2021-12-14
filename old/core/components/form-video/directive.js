(function (angular) {
	"use strict";
	
	angular.module("lt.core").directive("formVideo", ["$api", "zenVideoEmbedService", "$q", function ($api, zenVideoEmbedService, $q) { 
		return {
			restrict: "A",
			templateUrl: "components/form-video/index.html",
			scope : {
				model: "=formVideo",
				sectionId: "@sectionId",
				noUrl: "@",
				noUpload: "@"
			},
			link: function ($scope) {
				var canceler = $q.defer();

				$scope.my = {
					model: $scope.model,
				};

				function init () { 
					$scope.$watch(function () {
						return $scope.model;
					}, function (n, o) {
						if (n!==o && $scope.model && $scope.model.video_id && $scope.model.video_url && $scope.model.video_service) {
							canceler.resolve();
							canceler = $q.defer();

							$api.update("videos", $scope.model).exec(10, canceler).then(function (resp) {
								$scope.model = resp.data;
								return resp.data;
							});
						}
					}, true);

					$scope.$watch(function () {
						return ($scope.model ? $scope.model.video_url : null);
					}, function (n) {
						if (n) {
							var video = zenVideoEmbedService.getVideoFromUrl($scope.model.video_url);
							if (video && video.service && video.id) {
								$scope.model.video_service = video.service;
								$scope.model.video_id = video.id;
							}
						}
					});
				}

				init();
			}
		};
	}]);
})(window.angular);