export const key = "footer"

export const inject = ["$device"]

export const fn = ($device) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {},
		link: function ($scope) {
			function init() {
				defineScope()
				defineListeners()
			}

			function defineScope() {
				$scope.clicks = 0
				$scope.ind = {}
				$scope.ind.standalone = $device.isStandalone()
				$scope.ind.mobile = $device.isMobile()
				$scope.ind.apple = $device.isApple()
				$scope.year = new Date().getFullYear()
				$scope.onClick = onClick
			}

			function defineListeners() {}

			function onClick() {
				$scope.clicks++
			}

			init()
		},
	}
}
