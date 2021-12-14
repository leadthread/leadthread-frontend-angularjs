export const key = "limitTo"

export const inject = ["$timeout"]

export const fn = ($timeout) => {
	return {
		restrict: "A",
		link: function ($scope, $el, attrs) {
			var limit = parseInt(attrs.limitTo)

			$scope.$watch(
				function () {
					return $el.val()
				},
				function (n) {
					if (n.length > limit) {
						$timeout(function () {
							$el.val(n.substring(0, limit))
						})
					}
				}
			)
		},
	}
}
