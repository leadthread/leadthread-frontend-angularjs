export const inject = ["$compileProvider"]

export const fn = ($compileProvider) => {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|tel|mailto):/)
}
