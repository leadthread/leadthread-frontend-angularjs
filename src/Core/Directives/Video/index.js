import _ from "lodash"

export const key = "video"

export const inject = null

export const fn = () => {
	return {
		restrict: "A",
		// template: require("./index.html"),
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
