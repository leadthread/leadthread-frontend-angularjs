import _ from "lodash"

const key = "ContactController"

const inject = [
	"$scope",
	"contact",
	"users",
	"referrals",
	"campaigns",
	"$state",
	"$stateParams",
	"$q",
	"$api",
	"userContactJunction",
	"$device",
	"user",
	"company_id",
	"$title",
]

const fn = (
	$scope,
	contact,
	users,
	referrals,
	campaigns,
	$state,
	$stateParams,
	$q,
	$api,
	userContactJunction,
	$device,
	user,
	company_id,
	$title
) => {
	function init() {
		defineScope()
		defineListeners()
		setTitle()
	}

	function defineScope() {
		$scope.contact = contact
		$scope.users = users
		$scope.referrals = referrals
		$scope.campaigns = campaigns
		$scope.sendCampaignTo = sendCampaignTo
		$scope.userContactJunction = _.isArray(userContactJunction)
			? _.first(userContactJunction)
			: userContactJunction
		$scope.isMobile = isMobile
		$scope.user = user
		$scope.seeReferral = seeReferral
	}

	function defineListeners() {
		$scope.$watch("contact.id", setTitle)
	}

	function seeReferral(referral) {
		$state.go(
			"root.company.referral",
			{ referralId: referral.id },
			{ inherit: true }
		)
	}

	function setTitle() {
		$title.setTitle(
			$scope.contact.first_name + " " + $scope.contact.last_name
		)
	}

	function sendCampaignTo(c) {
		var obj = {}
		obj.contactId = contact.id
		if (c) {
			obj.campaignId = c.id
		}

		var params = _.merge(_.pick($stateParams, ["companyId"]), obj)
		$state.go("root.company.send", params)
	}

	/**
	 * Returns the device type
	 * @return {Boolean} Is mobile?
	 */
	function isMobile() {
		return $device.isMobile()
	}

	init()
}

export const Contact = {
	key,
	inject,
	fn,
}
