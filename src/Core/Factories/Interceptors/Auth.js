export const key = "AuthInterceptor"

export const inject = ["$rootScope", "$q", "AUTH_EVENTS"]

export const fn = ($rootScope, $q, AUTH_EVENTS) => {
	return {
		responseError: function (response) {
			$rootScope.$broadcast(
				{
					401: AUTH_EVENTS.notAuthenticated,
					403: AUTH_EVENTS.notAuthorized,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout,
				}[response.status],
				response
			)
			return $q.reject(response)
		},
	}
}
