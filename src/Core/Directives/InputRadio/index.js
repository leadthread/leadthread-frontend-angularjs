export const key = "inputRadio"

export const inject = ["$api"]

export const fn = ($api) => {
	return {
		restrict: "EA",
		template: require("./index.html"),
		scope: {
			model: "=ngModel",
			change: "=",
			value: "=",
			text: "@",
			name: "@",
			required: "=ngRequired",
		},
		link: function ($scope) {
			function init() {}

			init()
		},
	}
}
