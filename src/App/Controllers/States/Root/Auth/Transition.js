export const inject = ["$transitions", "$state", "$auth"]

export const fn = ($transitions, $state, $auth) => {
	$transitions.onBefore({ to: "root.auth" }, function () {
		return $state.target("root.auth.login")
	})

	$transitions.onBefore({ to: "root.auth.**" }, function (trans) {
		if ($auth.isLoggedIn() && trans.to().name !== "root.auth.register") {
			return $state.target("root.company")
		}
	})
}
