export const inject = ["$locationProvider"]

export const fn = ($locationProvider) => {
	$locationProvider.hashPrefix("")
}
