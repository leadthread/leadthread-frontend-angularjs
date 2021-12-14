import _ from "lodash"

export const key = "video"

export const inject = []

export const fn = () => {
	return {
		restrict: "A",
		templateUrl: "components/video/index.html",
		scope: {
			videoId: "=",
			videoType: "=",
		},
		link: function ($scope) {
			function init() {
				$scope.videoType = $scope.videoType
					? $scope.videoType
					: "youtube"

				if (_.isEmpty($scope.videoId)) {
					throw "$scope.videoId cannot be empty!"
				}
			}

			init()
		},
	}
}
