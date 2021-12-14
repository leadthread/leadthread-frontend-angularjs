import _ from "lodash"

export const inject = [
	"$transitions",
	"$auth",
	"$state",
	"$localStorage",
	"$device",
	"$window",
	"$location",
]

export const fn = (
	$transitions,
	$auth,
	$state,
	$localStorage,
	$device,
	$window,
	$location
) => {
	$state.defaultErrorHandler(console.error)

	$transitions.onSuccess({}, function (trans) {
		$localStorage.set("state-name", trans.to().name)
		$localStorage.set("state-params", _.cloneDeep(trans.params()))
	})

	$transitions.onSuccess({}, function () {
		$window.scrollTo(0, 0)
	})

	$transitions.onBefore({}, function (trans) {
		// if ($device.isStandalone()) {
		// 	var from = trans.from().name;
		// 	var to = $localStorage.get("state-name");
		// 	var params = _.omitBy($localStorage.get("state-params"), _.isNil);
		// 	var target = trans.to().name;
		// 	var targetParams = _.omitBy(_.cloneDeep(trans.params()), _.isNil);
		// 	if (_.isEmpty(from) && !_.isEmpty(to) && (to !== target || !_.isEqual(params, targetParams))) {
		// 		return $state.target(to, params);
		// 	}
		// }
	})

	$transitions.onBefore({ to: "root.**" }, function (trans) {
		var name = trans.to().name
		var host = $location.host()
		var url = $location.absUrl()

		var cond1 = host !== "app.yaptive.local"
		var cond2 = host !== "app.yaptive.com"
		var cond3 = host !== "stage.yaptive.com"
		var cond4 = !_.includes(name, "root")
		var cond5 = !_.includes(name, "root.link")
		var cond6 = !_.includes(name, "root.auth.register")

		if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6) {
			window.location.href = _.replace(url, host, "app.yaptive.com")
			return false
		}
	})
}
