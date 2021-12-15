export const key = "sectionSmsPreview"

export const inject = ["$placeholder"]

export const fn = ($placeholder) => {
	return {
		restrict: "AE",
		template: require("./index.html"),
		scope: {
			model: "=sectionSmsPreview",
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
