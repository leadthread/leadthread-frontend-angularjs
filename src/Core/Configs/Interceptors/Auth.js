export const inject = ["$httpProvider"]

export const fn = ($httpProvider) => {
	$httpProvider.interceptors.push([
		"$injector",
		function ($injector) {
			return $injector.get("AuthInterceptor")
		},
	])
}
