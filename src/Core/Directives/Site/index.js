import _ from "lodash"
import { Site } from "../../Classes"

export const key = "site"

export const inject = ["$api", "$q", "$device", "$timeout"]

export const fn = ($api, $q, $device, $timeout) => {
	return {
		restrict: "AE",
		template: require("./index.html"),
		scope: {
			site: "=",
			canEdit: "=canEdit",
			editing: "=",
			selectedSection: "=?",
			selectedPage: "=?",
			pageIndex: "=?",
			options: "=",
			scrollTo: "@",
		},
		link: function ($scope) {
			$scope.lock = "Loading"
			$scope.scroll_now = false
			function init() {
				if ($scope.site instanceof Site) {
					$scope.site.load(true).then(function () {
						console.log($scope.site)
						defineScope()
						defineListeners()
						$scope.lock = null
						$timeout(function () {
							$scope.scroll_now = true
						}, 200)
					})
				} else {
					console.error($scope.site)
					throw "Not a Site"
				}
			}

			function defineScope() {
				$scope.pageIndex = $scope.pageIndex || 0

				$scope.windowWidth = 0
				$scope.getSectionStyle = getSectionStyle
				$scope.editSection = editSection
				$scope.isSectionEnabled = isSectionEnabled
			}

			function defineListeners() {
				$scope.$on("SiteNext", selectNextPage)
				$scope.$on("SitePrev", selectPrevPage)
				$scope.$watch("pageIndex", function (n) {
					$scope.selectedPage = $scope.site.pages[n]
				})
				$scope.$watch(
					function () {
						return $device.width
					},
					function (n) {
						$scope.windowWidth = n
					}
				)
			}

			function editSection(section) {
				if (
					$scope.selectedSection &&
					$scope.selectedSection.id === section.id
				) {
					$scope.selectedSection = undefined
				} else {
					$scope.selectedSection = section
				}
			}

			function getSectionStyle(section) {
				let style, padding_vertical

				style = {
					background: section.background_color,
					color: section.font_color,
					"font-size": section.font_size + "px",
					"text-align": section.text_align,
				}

				return style
			}

			function selectNextPage() {
				var pageIndex = _.indexOf(
					$scope.site.pages,
					$scope.selectedPage
				)
				if (pageIndex < $scope.site.pages.length - 1) {
					pageIndex++
					this.$location.search("page", this.$scope.pageIndex)
				}
			}

			function selectPrevPage() {
				var pageIndex = _.indexOf(
					$scope.site.pages,
					$scope.selectedPage
				)
				if (pageIndex > 0) {
					pageIndex--
					this.$location.search("page", this.$scope.pageIndex)
				}
			}

			function isSectionEnabled(section) {
				return checkContactMissingCornerCase(section)
			}

			function checkContactMissingCornerCase(section) {
				let needToHide =
					!_.get($scope, "options.link.contact_id") &&
					_.includes(
						["share_title", "share_description"],
						section.name
					)
				return !needToHide
			}

			init()
		},
	}
}
