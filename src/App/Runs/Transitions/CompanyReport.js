import _ from "lodash"

export const inject = ["$transitions", "$state", "$auth"]

export const fn = ($transitions, $state, $auth) => {
	$transitions.onBefore({ to: "root.company.report" }, function (trans) {
		return $state.target(
			"root.company.report.referral",
			_.cloneDeep(trans.params())
		)
	})

	$transitions.onBefore({ to: "root.company.report.**" }, function (trans) {
		var name = trans.to().name
		var params = _.cloneDeep(trans.params())
		var userId = $auth.getUserId()

		return $auth.hasRole("Admin").then(function (isAdmin) {
			if (!isAdmin && params.user_id !== userId) {
				params.user_id = userId
				return $state.target(name, params)
			}
		})
	})
}
