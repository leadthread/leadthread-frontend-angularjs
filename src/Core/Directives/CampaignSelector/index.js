/* global _:false */
export const key = "campaignSelector"

export const inject = [
	"UserService",
	"$http",
	"$device",
	"$color",
	"$cache",
	"$auth",
	"$stateParams",
]

export const fn = (
	UserService,
	$http,
	$device,
	$color,
	$cache,
	$auth,
	$stateParams
) => {
	return {
		restrict: "EA",
		templateUrl: "components/campaign-selector/index.html",
		scope: {
			campaigns: "=",
			model: "=",
			type: "@?",
			placeholder: "@?",
		},
		// require: "uiSelect",
		link: function ($scope, $el, attrs, $select) {
			/**
			 * is run on directive construction
			 * @return undefined
			 */
			function init() {
				defineScope()
				defineListeners()
			}

			/**
			 * defines scope level variables
			 * @return undefined
			 */
			function defineScope() {
				$scope.campaign = { selected: $scope.model }
				$scope.groupCampaign = groupCampaign
				$scope.assignModel = assignModel
				$scope.searchEnabled = isDesktop()
				$scope.campaigns = _.isArray($scope.campaigns)
					? $scope.campaigns
					: []
				$scope.search = search
				$scope.auth_id = $auth.getUserId()

				// $scope.query = {value: ""};

				attachUsers()
			}

			/**
			 * defines listeners for this directive
			 * @return undefined
			 */
			function defineListeners() {}

			function isDesktop() {
				return $device.isDesktop()
			}

			/**
			 * convert item type to human readable string
			 * @param  {object} item object with type property
			 * @return {string}      Human readable string version of type property
			 */
			function groupCampaign(item) {
				switch (item.type) {
					case "testimonial-thread":
						return "TestimonialThread"
					case "leaderboard":
						return "Leaderboard"
					case "referral-thread":
						return "ReferralThread"
					case "message-thread":
						return "MessageThread"
					case "reach":
						return "Reach"
					case "recognition":
						return "Recognition"
					case "review":
						return "Review"
					default:
						return "Other"
				}
			}

			/**
			 * assigns select item to scope model
			 * @param  {object} item object to assign to $scope.model
			 * @return {undefined}      [description]
			 */
			function assignModel(item) {
				$scope.model = item
			}

			function attachUsers() {
				// _.forEach($scope.campaigns, function (campaign) {
				// 	UserService.show(campaign.owner_id).then(function (user) {
				// 		campaign.user_name = user.toString();
				// 	}, function () {
				// 		console.warn("Could not find user #"+campaign.owner_id+" for this company.");
				// 	});
				// });
			}

			function search(camp) {
				if (_.isNil($select.search)) {
					return true
				}

				if (
					camp.name.toLowerCase().indexOf($select.search || "") !== -1
				) {
					return true
				}

				return false
			}

			init()
		},
	}
}
