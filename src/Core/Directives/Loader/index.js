export const key = "loader"

export const inject = []

export const fn = () => {
	return {
		restrict: "A",
		templateUrl: "components/loader/index.html",
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
