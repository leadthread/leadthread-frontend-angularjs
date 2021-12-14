import _ from "lodash"

export const key = "sectionStaticForward"

export const inject = ["$placeholder", "$popup", "EventService"]

export const fn = ($placeholder, $popup, EventService) => {
	return {
		restrict: "A",
		templateUrl: "components/section/static-forward/index.html",
		scope: {
			model: "=sectionStaticForward",
			first: "&",
			last: "&",
			options: "=",
		},
		link: function ($scope, $el) {
			function init() {
				$scope.model.text = !_.isEmpty($scope.model.text)
					? $scope.model.text
					: "Share Now"
				$scope.parse = parse
				$scope.goNext = goNext
				$scope.getButtonStyle = getButtonStyle
				$scope.getIconClass = getIconClass
				$scope.openIncentive = openIncentive

				$el.closest("#target").addClass("has-forward-button")

				$scope.$on("$destroy", function () {
					$el.closest("#target").removeClass("has-forward-button")
				})
			}

			function getIconClass(icon) {
				if (icon === "earphone") {
					icon = "phone"
				}
				return "icon-" + icon
			}

			function getButtonStyle() {
				var style = {}
				style["background"] = $scope.model.button_color
				style["color"] = $scope.model.font_color
				style["border-radius"] = $scope.model.button_border_radius
				style["border"] =
					$scope.model.button_border_width +
					"px solid " +
					$scope.model.button_border_color
				style["line-height"] = "125%"
				style["height"] = "auto"
				return style
			}

			function openIncentive() {
				EventService.record($scope.options.link, "incentive_viewed")
				$popup.incentive($scope.options.incentive).then(goNext)
			}

			function parse(str) {
				return $placeholder.parse(str)
			}

			function goNext() {
				EventService.record($scope.options.link, "share_now")
				$scope.$emit("SiteNext")
			}

			init()
		},
	}
}
