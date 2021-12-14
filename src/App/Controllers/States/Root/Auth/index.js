export * from "./Code"
export * from "./Login"
export * from "./Logout"
export * from "./Register"
export * from "./Reset"

const key = "AuthController"

const inject = ["$scope", "$state", "$auth", "$api", "$notification", "$http"]

const fn = ($scope, $state, $auth, $api, $notification, $http) => {
	function init() {
		defineScope()
	}

	function defineScope() {
		//Values
		$scope.credentials = {}

		//Functions
		$scope.login = login
		$scope.loginWithCode = loginWithCode
		$scope.register = register
		$scope.isLoading = isLoading
		$scope.showLogo = showLogo
	}

	function showLogo() {
		return !$state.is("root.auth.register")
	}

	function login() {
		$auth
			.login($scope.credentials.email, $scope.credentials.password)
			.catch(console.error)
	}

	function isLoading() {
		return $http.pendingRequests.length > 0
	}

	function loginWithCode() {}

	function register() {}

	init()
}

export const Auth = {
	key,
	inject,
	fn,
}
