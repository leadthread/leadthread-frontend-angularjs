import _ from "lodash"

export const key = "404Intercepter"

export const inject = ["$q", "$notification"]

export const fn = ($q, $notification) => {
	return {
		responseError: function (response) {
			if (response.status === 404) {
				$notification.error(
					_.get(response, "data.error.message", "404: Not Found")
				)
			}
			return $q.reject(response)
		},
	}
}
