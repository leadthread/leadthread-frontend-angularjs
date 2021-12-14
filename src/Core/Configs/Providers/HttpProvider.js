export const inject = ["$httpProvider"]

export const fn = ($httpProvider) => {
	$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
	$httpProvider.defaults.xsrfHeaderName = "X-CSRF-TOKEN"
}
