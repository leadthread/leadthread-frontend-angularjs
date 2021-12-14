const key = "ContactsIndexController"

const inject = [
	"$scope",
	"$http",
	"company_id",
	"$api",
	"$cache",
	"users",
	"$notification",
	"$stateParams",
	"$location",
	"$state",
	"$device",
	"role",
]

const fn = (
	$scope,
	$http,
	company_id,
	$api,
	$cache,
	users,
	$notification,
	$stateParams,
	$location,
	$state,
	$device,
	role
) => {
	function init() {
		defineScope()
		defineListeners()
	}

	function defineScope() {
		$scope.opts = {}
		$scope.users = users
		$scope.role = role
		$scope.selected = []

		if ($stateParams.userId) {
			$scope.opts.user_id = parseInt($stateParams.userId)
		}
	}

	function defineListeners() {
		$scope.$watch(
			function () {
				return $scope.opts.user_id
			},
			function () {
				$location.search("userId", $scope.opts.user_id)
			}
		)
	}

	init()
}

export const CompanyContactsIndex = {
	key,
	inject,
	fn,
}
