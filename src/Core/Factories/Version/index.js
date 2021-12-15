export const key = "$version"

export const inject = ["$http", "$cache"]

export const fn = ($http, $cache) => {
	// To prevent duplicate requests...
	var request

	/**
	 * Start it up
	 */
	function init() {
		$cache.forget("version", true)
		$cache.remember(
			"version",
			5,
			function () {
				return { data: window.$VERSION }
			},
			true
		)
	}

	function getVersion() {
		return $cache.remember(
			"version",
			15,
			function () {
				if (request) {
					return request
				}
				request = $http.get("/api/v1/version").finally(function (resp) {
					request = null
					return resp
				})
				return request
			},
			true
		)
	}

	init()

	return {
		getVersion: getVersion,
	}
}
