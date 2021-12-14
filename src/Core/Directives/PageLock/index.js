import _ from "lodash"

export const key = "pageLock"

export const inject = []

export const fn = () => {
	return {
		restrict: "A",
		templateUrl: "components/page-lock/index.html",
		transclude: true,
		scope: {
			lock: "=pageLock",
			position: "@",
		},
		link: function ($scope, $el) {
			function init() {
				defineScope()
				defineListeners()

				onPositionChange($scope.position)
			}

			function defineScope() {
				$scope.position = _.get($scope, "position", "fixed")
				$scope.lock = _.get($scope, "lock", null)
			}

			function defineListeners() {
				$scope.$watch("position", onPositionChange)
				$scope.$watch("lock", onLockChange)
			}

			function onLockChange(n) {
				if (n) {
					$el.removeClass("hide")
				} else {
					$el.addClass("hide")
				}
			}

			function onPositionChange(n, o) {
				if (o) {
					$el.removeClass(o)
				}

				$el.addClass(n)
			}

			init()
		},
	}
}
