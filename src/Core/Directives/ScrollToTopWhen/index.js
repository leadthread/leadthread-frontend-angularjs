export const key = "scrollToTopWhen"

export const inject = null

export const fn = () => {
	return {
		restrict: "A",
		scope: {
			trigger: "=scrollToTopWhen",
		},
		link: function ($scope, $el) {
			/**
			 * Start it up
			 */
			function init() {
				$scope.$watch("trigger", function () {
					$el[0].scrollTop = 0
				})
			}

			init()
		},
	}
}
