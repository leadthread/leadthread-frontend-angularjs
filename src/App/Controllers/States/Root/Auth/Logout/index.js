const key = "LogoutController"

const inject = ["$scope", "$auth"]

function fn($scope, $auth) {
	function init() {
		$auth.logout()
	}

	init()
}

export const AuthLogout = {
	key,
	inject,
	fn,
}
