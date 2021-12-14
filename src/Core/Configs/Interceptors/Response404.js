export const inject = ["$httpProvider"]

export const fn = ($httpProvider) => {
	$httpProvider.interceptors.push("404Intercepter")
}
