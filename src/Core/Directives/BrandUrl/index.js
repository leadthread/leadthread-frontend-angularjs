export const key = "brandUrl"

export const inject = ["$api"]

export const fn = ($api) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			company: "=brandUrl",
		},
		link: function ($scope) {
			function init() {
				$scope.url_display = $scope.company.url.replace(
					/https?:\/\//,
					""
				)
			}

			init()
		},
	}
}
