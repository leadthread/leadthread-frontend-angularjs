export const inject = ["$transitions", "$state", "$auth"]

export const fn = ($transitions, $state, $auth) => {
	$transitions.onBefore({ to: "root.console" }, function () {
		return $auth.isSuperAdmin().then(function (isSuperAdmin) {
			if (!isSuperAdmin) {
				return $state.target("root")
			}
		})
	})
}
