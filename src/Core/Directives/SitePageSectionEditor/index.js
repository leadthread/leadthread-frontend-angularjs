import _ from "lodash"

export const key = "sitePageSectionEditor"

export const inject = ["$api", "$timeout"]

export const fn = ($api, $timeout) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			section: "=sitePageSectionEditor",
			removeSection: "&",
		},
		link: function ($scope) {
			var timeout

			function init() {
				defineScope()
				defineListeners()
			}

			function defineScope() {
				$scope.remove = remove
				$scope.moveUp = moveUp
				$scope.moveDown = moveDown
				$scope.sectionHasButton = sectionHasButton
				$scope.sectionHasText = sectionHasText
			}

			function defineListeners() {
				$scope.$watch(
					function () {
						var section = _.clone($scope.section)
						delete section.video
						delete section.file

						return JSON.stringify(section)
					},
					function (n, o) {
						if (n !== o) {
							var section = _.clone($scope.section.valueOf())
							delete section.video
							delete section.file
							delete section.prompts

							$timeout.cancel(timeout)
							timeout = $timeout(function () {
								$api.update("sections", section)
									.exec()
									.then(function (x) {
										return x.data
									})
							}, 1000)
						}
					}
				)
			}

			function moveUp(id) {
				$scope.$emit("Section.MoveUp", id)
			}

			function moveDown(id) {
				$scope.$emit("Section.MoveDown", id)
			}

			function remove(id) {
				$scope.$emit("Section.Remove", id)
			}

			function sectionHasButton() {
				var buttons = ["tel", "url", "nav", "sms", "collect"]
				return buttons.indexOf($scope.section.type) >= 0
			}

			function sectionHasText() {
				var buttons = [
					"tel",
					"url",
					"sms",
					"nav",
					"text",
					"title",
					"collect",
				]
				return buttons.indexOf($scope.section.type) >= 0
			}

			init()
		},
	}
}
