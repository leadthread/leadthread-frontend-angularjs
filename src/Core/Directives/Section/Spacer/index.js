export const key = "sectionSpacer"

export const inject = ["$placeholder"]

export const fn = ($placeholder) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			model: "=sectionSpacer",
		},
		link: function ($scope) {
			function init() {
				$scope.parse = parse
			}

			function parse(str) {
				return $placeholder.parse(str)
			}

			init()
		},
	}
}
