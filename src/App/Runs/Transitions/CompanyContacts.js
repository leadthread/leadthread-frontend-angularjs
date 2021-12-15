import _ from "lodash"

export const inject = ["$transitions", "$auth", "$state"]

export const fn = ($transitions, $auth, $state) => {
	$transitions.onBefore({ to: "root.company.contacts" }, function (trans) {
		return $state.target(
			"root.company.contacts.index",
			_.cloneDeep(trans.params())
		)
	})
}
