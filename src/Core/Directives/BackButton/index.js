export const key = "backButton"

export const inject = ["$window"]

export const fn = ($window) => {
	return {
		restrict: "EA",
		template: require("./index.html"),
		// transclude: true,
		scope: {
			icon: "@",
		},
		link: function ($scope) {
			function init() {
				$scope.icon = $scope.icon === "true"
				$scope.onClick = onClick
			}

			function onClick() {
				$window.history.back()
			}

			init()
		},
	}
}
