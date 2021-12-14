export const key = "sectionPdf"

export const inject = []

export const fn = () => {
	return {
		restrict: "A",
		templateUrl: "components/section/pdf/index.html",
		scope: {
			model: "=sectionPdf",
		},
		link: function ($scope) {
			function init() {}

			init()
		},
	}
}
