import $ from "jquery"
export const key = "scrollToWhen"

export const inject = []

export const fn = () => {
	return {
		restrict: "A",
		scope: {
			trigger: "=scrollToWhen",
		},
		link: function ($scope, $el) {
			/**
			 * Start it up
			 */
			function init() {
				$scope.$watch("trigger", function (n, o) {
					if (n !== o && !!n) {
						$("html, body")
							.stop()
							.animate(
								{
									scrollTop: $el.offset().top - 80,
								},
								200
							)
					}
				})
			}

			init()
		},
	}
}
