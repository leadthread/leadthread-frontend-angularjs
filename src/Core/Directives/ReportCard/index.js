export const key = "reportCard"

export const inject = null

export const fn = () => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			model: "=reportCard",
		},
		link: function ($scope) {
			function init() {}

			init()
		},
	}
}
