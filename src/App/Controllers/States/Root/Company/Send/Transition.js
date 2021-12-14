import _ from "lodash"

export const inject = ["$transitions", "$state", "$auth", "$q"]

export const fn = ($transitions, $state, $auth, $q) => {
	$transitions.onBefore({ to: "root.company.send" }, function (trans) {
		var name = trans.to().name
		var params = _.cloneDeep(trans.params())
		var userId = $auth.getUserId()
		var x = {
			users: trans.injector().getAsync("users"),
			isAdmin: trans.injector().getAsync("isAdmin"),
		}

		return $q.all(x).then(function (x) {
			// Figure out the user id
			var cond1 = !params.userId
			var cond2 = x.isAdmin && !_.find(x.users, { id: params.userId })
			var cond3 = !x.isAdmin && params.userId !== userId
			if (cond1 || cond2 || cond3) {
				params.userId = userId
				return $state.target(name, params)
			}

			// Figure out the type
			if (_.indexOf(["campaign", "playlist"], params.type) <= -1) {
				if (params.playlistId) {
					params.type = "playlist"
				} else {
					params.type = "campaign"
				}
				return $state.target(name, params)
			} else if (params.type === "playlist" && params.campaignId) {
				params.campaignId = null
				return $state.target(name, params)
			} else if (params.type === "campaign" && params.playlistId) {
				params.playlistId = null
				return $state.target(name, params)
			}
			return true
		})
	})
}
