export const key = "sectionText"

export const inject = ["$placeholder", "$sce", "$sanitize"]

export const fn = ($placeholder, $sce, $sanitize) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			model: "=sectionText",
		},
		link: function ($scope) {
			function init() {
				$scope.parse = parse
			}

			function parse(str) {
				return $sce.trustAsHtml($sanitize($placeholder.parse(str)))
			}

			init()
		},
	}
}
