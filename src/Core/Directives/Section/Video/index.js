import _ from "lodash"

export const key = "sectionVideo"

export const inject = ["$api", "$timeout", "EventService"]

export const fn = ($api, $timeout, EventService) => {
	return {
		restrict: "A",
		templateUrl: "components/section/video/index.html",
		scope: {
			model: "=sectionVideo",
			options: "=",
		},
		link: function ($scope, $el) {
			function init() {
				$scope.started = false
				$scope.finished = false
				$scope.onPlayed = onPlayed
				$scope.onPaused = onPaused
				$scope.onEnded = onEnded

				if (!$scope.model.video) {
					$scope.model.video = {}
				}

				if (
					$scope.model.type === "video" &&
					!$scope.model.video.id &&
					$scope.model.id
				) {
					$api.show("sections", $scope.model.id)
						.index("videos")
						.exec()
						.then(function (resp) {
							$scope.model.video = _.first(resp.data) || {}
							return resp.data
						})
				}

				$scope.$watch(
					function () {
						return JSON.stringify($scope.model.video)
					},
					function () {
						if (
							$scope.model &&
							$scope.model.video &&
							$scope.model.video.id
						) {
							$scope.model.video_id = $scope.model.video.id
						}
					}
				)
			}

			function onPlayed() {
				if (!$scope.started) {
					EventService.record($scope.options.link, "video_played")
					$scope.started = true
				}
			}

			function onPaused() {
				// Do nothing
			}

			function onEnded() {
				if (!$scope.finished) {
					EventService.record($scope.options.link, "video_ended")
					$scope.finished = true
				}
			}

			init()
		},
	}
}
