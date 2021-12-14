import _ from "lodash"

export const key = "500Intercepter"

export const inject = ["$q", "$notification"]

export const fn = ($q, $notification) => {
	return {
		responseError: function (response) {
			if (response.status >= 500 && response.status < 600) {
				$notification.error(
					_.get(response, "data.error.message", "Server Error")
				)
			}
			return $q.reject(response)
		},
	}
}
