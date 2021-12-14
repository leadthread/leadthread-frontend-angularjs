(function (angular, _) {
	"use strict";

	angular.module("lt.core").directive("userlistDirective", ["$stateParams", "$api", function ($stateParams, $api) {
		return {
			restrict: "EA",
			templateUrl: "components/userlist/index.html",
			link: function ($scope) {
				function init () {
					defineScope();
					defineListeners();
				}

				function defineScope () {
					$scope.currentUser = -1;
					$scope.toggleCampaigns = toggleCampaigns;
					getUsers();
				}

				function defineListeners () {

				}

				function getUsers () {
					var companyId = $stateParams.companyId;
					$api.show("companies", companyId).index("users").exec().then(function (resp) {
						var users = resp.data;
						_.forEach(users, function (x) {
							$api.show("users", x.id).index("roles", {
								"company_id":companyId, "user_id":x.id
							}).exec().then(function (re) {
								x.role = re.data[0].name;
								
								$api.show("users", x.id).index("campaigns", {
									"company_id":companyId
								}).exec().then(function (res) {
									x.campaigns = res.data;
									$scope.users = users;
								});
							});

						});
					});
				}

				function toggleCampaigns (userId) {
					if ($scope.currentUser == userId) {
						$scope.currentUser = -1;
					} else {
						$scope.currentUser = userId;
					}
				}

				init();
			}
		};
	}]);
})(window.angular, window._);