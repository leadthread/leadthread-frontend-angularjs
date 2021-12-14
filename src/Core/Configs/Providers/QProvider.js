export const inject = ["$qProvider"]

export const fn = ($qProvider) => {
	$qProvider.errorOnUnhandledRejections(true)
}
