export const key = "sectionSocialPreview"

export const inject = ["$placeholder"]

export const fn = ($placeholder) => {
	return {
		restrict: "AE",
		template: require("./index.html"),
		scope: {
			model: "=sectionSocialPreview",
		},
		link: function ($scope) {
			function init() {
				$scope.date = new Date()
				$scope.parse = parse
			}

			function parse(str) {
				return $placeholder.parse(str)
			}

			init()
		},
	}
}
