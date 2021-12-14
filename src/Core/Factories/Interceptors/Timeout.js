export const key = "TimeoutInterceptor"

export const inject = ["$q"]

export const fn = ($q) => {
	return {
		responseError: function (response) {
			if (response.status === -1) {
				console.warn(
					"Request... CANCELLED! (It timed out or could not connect to the internet)"
				)
			}
			return $q.reject(response)
		},
	}
}
