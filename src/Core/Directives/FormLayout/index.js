export const key = "formLayout"

export const inject = ["$popup"]

export const fn = ($popup) => {
	return {
		restrict: "E",
		templateUrl: "components/form-layout/index.html",
		scope: {
			form: "=",
			options: "=",
		},
		link: function ($scope) {
			function init() {
				$scope.focus = null
				$scope.setFocus = setFocus
			}

			function setFocus(key) {
				$scope.focus = key
			}

			init()
		},
	}
}
