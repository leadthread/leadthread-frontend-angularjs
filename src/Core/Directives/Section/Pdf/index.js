export const key = "sectionPdf"

export const inject = null

export const fn = () => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			model: "=sectionPdf",
		},
		link: function ($scope) {
			function init() {}

			init()
		},
	}
}
