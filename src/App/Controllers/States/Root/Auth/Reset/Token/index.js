const key = "AuthResetTokenController"

const inject = [
	"$scope",
	"$http",
	"$notification",
	"$stateParams",
	"$auth",
	"$state",
]

const fn = ($scope, $http, $notification, $stateParams, $auth, $state) => {
	function init() {
		$scope.$parent.$parent.credentials = {
			email: $stateParams.email,
			token: $stateParams.token,
		}
		$scope.reset = reset
	}

	function reset() {
		$http.post("/password/reset", $scope.$parent.$parent.credentials).then(
			function (resp) {
				var c = $scope.$parent.$parent.credentials
				$notification.success(resp)
				$auth.login(c.email, c.password).catch(console.error)
			},
			function (resp) {
				if (
					resp.data.error.message ===
					"This password reset token is invalid."
				) {
					$state.go("^")
				}
			}
		)
	}

	init()
}

export const AuthResetToken = {
	key,
	inject,
	fn,
}
