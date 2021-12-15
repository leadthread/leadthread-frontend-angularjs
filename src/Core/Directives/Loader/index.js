export const key = "loader"

export const inject = null

export const fn = () => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			text: "@loader",
			white: "=",
		},
		link: function () {
			function init() {
				// Do something
			}

			init()
		},
	}
}
