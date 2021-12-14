import _ from "lodash"

export const key = "navbarDirective"

export const inject = [
	"$rootScope",
	"$stateParams",
	"$state",
	"$pages",
	"$auth",
	"$api",
	"$http",
	"$company",
	"$notification",
	"$favicon",
	"$transitions",
	"$messages",
	"$title",
]

export const fn = (
	$rootScope,
	$stateParams,
	$state,
	$pages,
	$auth,
	$api,
	$http,
	$company,
	$notification,
	$favicon,
	$transitions,
	$messages,
	$title
) => {
	return {
		restrict: "EA",
		templateUrl: "components/navbar/index.html",
		scope: {
			selectedCompany: "=selected",
			windowWidth: "=",
		},
		link: function ($scope) {
			function init() {
				defineScope()
				defineListeners()
			}

			function defineScope() {
				updateFavicon()
				$scope.showMenu = false
				$scope.titleMode = false
				$scope.navText = false
				$scope.favicon = null
				$scope.pages = []

				//Functions
				$scope.openMenu = openMenu
				$scope.closeMenu = closeMenu
				$scope.toggleMenu = toggleMenu
				$scope.getTitle = getTitle
				$scope.onCompanyChange = onCompanyChange
				$scope.isLoading = isLoading
				$scope.hoverIn = hoverIn
				$scope.hoverOut = hoverOut
				$scope.getBadgeValue = getBadgeValue
				$scope.onMenuItemClick = onMenuItemClick

				assignBadges()
			}

			function onMenuItemClick(item) {
				item.params = item.params || {}
				if (item.sref) {
					$state.go(item.sref, item.params)
					closeMenu()
				} else {
					// toggle the submenu
					item.open = !item.open
				}
			}

			function collapseSubMenus() {
				_.forEach($scope.pages, function (item) {
					if (!item.sref && item.open) {
						item.open = false
					}
				})
			}

			function assignBadges() {
				_.forEach($scope.pages, function (page) {
					if (page.badgeKey == "messages") {
						page.badge = $messages.getTotalUnreadConversations
					} else {
						page.badge = 0
					}
				})
			}

			function getBadgeValue(page) {
				if (_.isFunction(page.badge)) {
					return page.badge()
				}
				return page.badge
			}

			function hoverIn() {
				$scope.navText = true
			}

			function hoverOut() {
				$scope.navText = false
			}

			function defineListeners() {
				$transitions.onSuccess(
					{ to: "root.company.**" },
					onStateChangeSuccess
				)

				$scope.$watch(
					function () {
						return $stateParams.companyId
					},
					function (n, o) {
						if (n !== o) {
							var company = $scope.selectedCompany
							if (company.status == "disabled") {
								$notification.error(
									company.name +
										" is disabled. Please contact your Yaptive representative."
								)
								$scope.selectedCompany = company
								updateFavicon()
							}
						}
					}
				)

				$scope.$watch(
					function () {
						return $scope.selectedCompany.favicon_id
					},
					function (n, o) {
						if (n != o) {
							updateFavicon()
						}
					}
				)

				$scope.$watch(function () {
					return $scope.selectedCompany
						? $scope.selectedCompany.id
						: null
				}, onCompanyChange)

				window.addEventListener(
					"scroll",
					function () {
						var top = this.scrollY
						$scope.$apply(function () {
							onTopChange(top)
						})
					},
					false
				)
			}

			function updateFavicon() {
				$company.getFavicon().then(
					function (favicon) {
						$scope.favicon =
							"/files/" + favicon.fingerprint + "/stretch/50/50"
					},
					function () {
						$favicon.resetFavicon()
					}
				)
			}

			function onTopChange(top) {
				$scope.titleMode = top >= 68
			}

			function isLoading() {
				return $http.pendingRequests.length > 0
			}

			function toggleMenu() {
				$scope.showMenu = !$scope.showMenu
			}

			function openMenu() {
				$scope.showMenu = true
			}

			function closeMenu() {
				$scope.showMenu = false
			}

			function onStateChangeSuccess() {
				collapseSubMenus()
				closeMenu()
			}

			function getTitle() {
				return $title.getTitle()
			}

			function onCompanyChange(n, o) {
				if (n && n !== o) {
					$state.go("root.company.dashboard", {
						companyId: n,
					})
				}

				$pages.get().then(function (pages) {
					$scope.pages = pages
					assignBadges()
				})
			}

			init()
		},
	}
}
