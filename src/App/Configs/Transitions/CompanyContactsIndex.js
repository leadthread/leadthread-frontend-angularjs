import _ from "lodash"

export const inject = ["$transitions", "$auth", "$state"]

export const fn = ($transitions, $auth, $state) => {
	$transitions.onBefore(
		{ to: "root.company.contacts.index" },
		function (trans) {
			var params = _.cloneDeep(trans.params())
			var userId = $auth.getUserId()

			return $auth.hasRole("Admin").then(function (isAdmin) {
				if (!params.userId || (!isAdmin && params.userId !== userId)) {
					params.userId = userId
					return $state.target("root.company.contacts.index", params)
				}
			})
		}
	)
}
