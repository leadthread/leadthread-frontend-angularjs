export const key = "reportCard"

export const inject = []

export const fn = () => {
	return {
		restrict: "A",
		templateUrl: "components/report-card/index.html",
		scope: {
			model: "=reportCard",
		},
		link: function ($scope) {
			function init() {}

			init()
		},
	}
}
