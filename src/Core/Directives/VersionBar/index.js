export const key = "versionbar"

export const inject = ["$version", "$interval"]

export const fn = ($version, $interval) => {
	return {
		restrict: "E",
		templateUrl: "components/versionbar/index.html",
		scope: {},
		link: function ($scope) {
			function init() {
				$scope.refresh = refresh
				$scope.display = false

				$interval(function () {
					$version.getVersion().then(
						function (newVersion) {
							$scope.display = window.$VERSION !== newVersion.data
						},
						function (reason) {
							console.warn(reason)
						}
					)
				}, 1000)
			}

			function refresh() {
				location.reload()
			}

			init()
		},
	}
}
