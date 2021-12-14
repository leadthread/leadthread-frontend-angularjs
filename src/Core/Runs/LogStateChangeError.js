export const inject = ["$rootScope"]

export const fn = ($rootScope) => {
	$rootScope.$on("$stateChangeError", console.error)
}
