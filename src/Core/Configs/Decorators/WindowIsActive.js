// main visibility API function
// use visibility API to check if current tab is active or not

export const inject = ["$provide"]

export const fn = ($provide) => {
	$provide.decorator("$window", [
		"$delegate",
		function ($delegate) {
			var isActive = (function () {
				var stateKey,
					eventKey,
					keys = {
						hidden: "visibilitychange",
						webkitHidden: "webkitvisibilitychange",
						mozHidden: "mozvisibilitychange",
						msHidden: "msvisibilitychange",
					}

				for (stateKey in keys) {
					if (stateKey in document) {
						eventKey = keys[stateKey]
						break
					}
				}

				return function (c) {
					if (c) document.addEventListener(eventKey, c)
					return !document[stateKey]
				}
			})()

			$delegate.isActive = isActive
			return $delegate
		},
	])
}
