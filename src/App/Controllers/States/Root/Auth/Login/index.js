export const key = "AuthLoginController"

export const inject = ["$scope", "$state"]

export function fn($scope, $state) {
	function init() {
		$scope.credentials = {}
	}

	init()
}

export const AuthLogin = {
	key,
	inject,
	fn,
}
