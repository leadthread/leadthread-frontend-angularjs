export * from "./Index"

const key = "ContactsController"

const inject = ["$scope"]

function fn($scope) {
	function init() {
		defineScope()
		defineListeners()
	}

	function defineScope() {}

	function defineListeners() {}

	init()
}

export const CompanyContacts = {
	key,
	inject,
	fn,
}
