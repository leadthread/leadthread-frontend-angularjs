import _ from "lodash"

export const inject = ["$transitions", "$state", "$location"]

export const fn = ($transitions, $state, $location) => {
	$transitions.onBefore({ to: "root.**" }, function (trans) {
		var name = trans.to().name
		var host = $location.host()
		var url = $location.absUrl()

		var cond1 = host !== "app.yaptive.local"
		var cond2 = host !== "app.yaptive.com"
		var cond3 = host !== "stage.yaptive.com"
		var cond4 = !_.includes(name, "root.link")
		var cond5 = !_.includes(name, "root.auth.register")
		var cond6 = !_.includes(host, "localhost")

		if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6) {
			window.location.href = _.replace(url, host, "app.yaptive.com")
			return false
		}
	})

	$transitions.onBefore({ to: "root" }, function () {
		return $state.target("root.auth")
	})
}
