export const key = "tableOfContents"

export const inject = null

export const fn = () => {
	return {
		restrict: "EA",
		template: require("./index.html"),
		scope: {
			items: "=",
			item: "=",
		},
		link: function ($scope) {
			function init() {
				$scope.selectItem = selectItem
				$scope.isActive = isActive
			}

			function isActive(item) {
				return item.name === $scope.item
			}

			function selectItem(item) {
				$scope.item = item.name
			}

			init()
		},
	}
}
