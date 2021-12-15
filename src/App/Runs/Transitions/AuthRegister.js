export const inject = ["$transitions", "$state", "$q", "$auth", "$http"]

export const fn = ($transitions, $state, $q, $auth, $http) => {
	$transitions.onBefore({ to: "root.auth.register" }, function (trans) {
		var x = trans.injector().getAsync("link")
		return x.then(function (link) {
			if (link.contact_id) {
				return $auth.loginWithLink(link).then(function () {
					return $state.target("root.link", { linkId: link.id })
				})
			} else {
				return true
			}
		})
	})
}
