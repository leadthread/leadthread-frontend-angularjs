/*
 * @Author: Tyler Arbon
 * @Date:   2017-07-24 17:16:52
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-24 17:27:28
 */

export const key = "event"

export const inject = ["EventService"]

export const fn = (EventService) => {
	return {
		restrict: "A",
		// template: require("./index.html"),
		scope: {
			type: "@",
			link: "=",
		},
		link: function ($scope, $el) {
			function init() {
				defineScope()
				defineListeners()
			}

			function defineScope() {
				// Nothing
			}

			function defineListeners() {
				$el.bind("click", function () {
					EventService.record($scope.link, $scope.type)
				})
			}

			init()
		},
	}
}
