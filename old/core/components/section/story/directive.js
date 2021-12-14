(function (angular) {
	"use strict";

	angular.module("lt.core").directive("sectionStory", ["$api", "$location", "$q", "EventService", function ($api, $location, $q, EventService) {
		return {
			restrict: "A",
			templateUrl: "components/section/story/index.html",
			scope : {
				model:"=sectionStory",
				options: "="
			},
			link: function ($scope) {

				/**
				 * Start it up
				 */
				function init () {
					$scope.started = false;
					$scope.finished = false;
					$scope.onPlayed = onPlayed;
					$scope.onPaused = onPaused;
					$scope.onEnded = onEnded;
					$scope.error = false;
					$scope.story = $scope.options.story;

					$scope.media = {
						type: null, // video, image, pdf
						video: null,
						file: null,
					};

					$scope.$watch(getSchemeToLoad, onSchemeChange, true);
				}

				function getSchemeToLoad () {
					var containers = ["story", "model"];
					var resources = ["video", "file"];

					var scheme = {};
					containers.forEach(function (container) {
						resources.forEach(function (resource) {
							var x = _.get($scope, container+"."+resource+"_id", null);
							if (x && !scheme.id) {
								scheme = {resource: resource, id: x};
							}
						});
					});
					return scheme;
				}

				function onSchemeChange (scheme) {
					var promise;
					switch (scheme.resource) {
					case "video":
						promise = fetchVideo(scheme.id);
						break;
					case "file":
						promise = fetchFile(scheme.id);
						break;
					}

					return promise;
				}

				/**
				 * Retrieves the Video Model from the server
				 * @param  {Integer} id The ID of video
				 * @return {Promise} 
				 */
				function fetchVideo (id) {
					return $api.show("videos", id).exec().then(function (resp) {
						$scope.media.type = "video";
						$scope.media.video = resp.data;
						return resp.data;
					});
				}

				/**
				 * Retrieves the Image Model from the server
				 * @param  {Integer} id The ID of image
				 * @return {Promise}
				 */
				function fetchFile (id) {
					return $api.show("files", id).exec().then(function (resp) {
						$scope.media.type = resp.data.mime === "application/pdf" ? "pdf" : "image";
						$scope.media.file = resp.data;
						return resp.data;
					});
				}

				function onPlayed() {
					if(!$scope.started) {
						EventService.record($scope.options.link, "video_played");
						$scope.started = true;
					}
				}
				
				function onPaused() {
					// Do nothing
				}

				function onEnded() {
					if(!$scope.finished) {
						EventService.record($scope.options.link, "video_ended");
						$scope.finished = true;
					}
				}

				init();
			}
		};
	}]);
})(window.angular, window._);