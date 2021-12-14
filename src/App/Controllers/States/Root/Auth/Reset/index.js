export * from "./Token"

const key = "AuthResetController"

const inject = ["$scope", "$http", "$notification"]

const fn = ($scope, $http, $notification) => {
	function init() {
		$scope.reset = reset
	}

	function reset() {
		$http
			.post("/password/email", $scope.$parent.credentials)
			.then(function (resp) {
				$notification.success(
					"An email with instructions has been sent to that email address."
				)
				$scope.$parent.credentials = {}
			})
	}

	init()
}

export const AuthReset = {
	key,
	inject,
	fn,
}
