import _ from "lodash"

export * from "./Contact"
export * from "./Contacts"
export * from "./Create"
export * from "./Dashboard"
export * from "./Leaderboard"
export * from "./Leaderboards"
export * from "./Manage"
export * from "./Message"
export * from "./Playlist"
export * from "./Referral"
export * from "./Report"
export * from "./Send"
export * from "./Settings"
export * from "./UserSettings"

const key = "CompanyController"

const inject = [
	"$scope",
	"$state",
	"companies",
	"$stateParams",
	"$rootScope",
	"$auth",
	"$placeholder",
	"$company",
	"$socket",
	"$notification",
	"$api",
	"$q",
	"$messages",
]

const fn = (
	$scope,
	$state,
	companies,
	$stateParams,
	$rootScope,
	$auth,
	$placeholder,
	$company,
	$socket,
	$notification,
	$api,
	$q,
	$messages
) => {
	var user

	function init() {
		user = $auth.getUser()

		defineScope()
		defineListeners()
		definePlaceholders()

		//Load up conversations
		$messages.clearContacts()
		$messages.loadContacts()
	}

	function defineScope() {
		$scope.companies = companies
		$rootScope.company = _.find($scope.companies, {
			id: $stateParams.companyId,
		})
		$company.setCompany($rootScope.company)
	}

	function defineListeners() {
		$socket.subscribe("user." + user.id + ".sms")
	}

	function definePlaceholders() {
		$placeholder.clear().set({
			company: $scope.company.name,
			"sales-rep-first-name": user.first_name,
			"sales-rep-last-name": user.last_name,
			"sales-rep-full-name": user.first_name + " " + user.last_name,
		})

		$scope.$on("$destroy", function () {
			$socket.unsubscribe("user." + user.id + ".sms")
		})
	}

	init()
}

export const Company = {
	key,
	inject,
	fn,
}
