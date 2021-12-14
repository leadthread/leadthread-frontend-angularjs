namespace lt {
	angular.module("lt.core").directive("site", ["$api", "$q", "$device", "$timeout", function ($api, $q, $device, $timeout) {
		return {
			restrict: "AE",
			templateUrl: "components/site/index.html",
			scope : {
				site:"=",
				canEdit:"=canEdit",
				editing:"=",
				selectedSection: "=?",
				selectedPage: "=?",
				pageIndex: "=?",
				options:"=",
				scrollTo:"@",
			},
			link: function ($scope) {
				$scope.lock = "Loading";
				$scope.scroll_now = false;
				function init () {
					if ($scope.site instanceof Site) {
						$scope.site.load(true).then(function () {
							defineScope();
							defineListeners();
							$scope.lock = null;
							$timeout(function() {
								$scope.scroll_now = true;
							}, 200)
						});
					} else {
						throw "Not a Site";
					}
				}

				function defineScope () {
					$scope.pageIndex = $scope.pageIndex || 0;

					$scope.windowWidth = 0;
					$scope.getSectionStyle = getSectionStyle;
					$scope.editSection = editSection;
					$scope.isSectionEnabled = isSectionEnabled;
				}

				function defineListeners () {
					$scope.$on("SiteNext", selectNextPage);
					$scope.$on("SitePrev", selectPrevPage);
					$scope.$watch("pageIndex", function (n) {
						$scope.selectedPage = $scope.site.pages[n];
					});
					$scope.$watch(function () {
						return $device.width;
					}, function (n) {
						$scope.windowWidth = n;
					});
				}

				function editSection (section: ISection) {
					if ($scope.selectedSection && $scope.selectedSection.id === section.id) {
						$scope.selectedSection = undefined;
					} else {
						$scope.selectedSection = section;
					}
				}

				function getSectionStyle (section: ISection): IStyle {
					let style: IStyle,
						padding_vertical: number;

					style = {
						"background": section.background_color,
						"color": section.font_color,
						"font-size": section.font_size + "px",
						"text-align": section.text_align
					};

					return style;
				}

				function selectNextPage () {
					var pageIndex = _.indexOf($scope.site.pages, $scope.selectedPage);
					if (pageIndex < $scope.site.pages.length - 1) {
						pageIndex++;
						this.$location.search("page", this.$scope.pageIndex);
					}
				}

				function selectPrevPage () {
					var pageIndex = _.indexOf($scope.site.pages, $scope.selectedPage);
					if (pageIndex > 0) {
						pageIndex--;
						this.$location.search("page", this.$scope.pageIndex);
					}
				}

				function isSectionEnabled(section) {
					return checkContactMissingCornerCase(section)
				}

				function checkContactMissingCornerCase(section) {
					let needToHide = !_.get($scope, "options.link.contact_id") && _.includes(["share_title", "share_description"], section.name)
					return !needToHide;
				}

				init();
			}
		};
	}]);
}