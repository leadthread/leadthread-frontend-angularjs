import _ from "lodash"

export const key = "PopupContactsController"

export const inject = ["options", "$scope", "$uibModalInstance"]

export function fn(options, $scope, $uibModalInstance) {
	function init() {
		defineScope()
		defineListeners()

		_.forEach($scope.options.contacts, function (contact) {
			contact.selected = false
		})
	}

	function defineScope() {
		$scope.ok = ok
		$scope.cancel = cancel
		$scope.options = options
	}

	function defineListeners() {}

	function getDataFromForm() {
		return _.filter($scope.options.contacts, { selected: true })
	}

	function ok(valid) {
		if (valid) {
			$uibModalInstance.close(getDataFromForm())
		}
	}

	function cancel(reason) {
		reason = reason || "cancel"
		$uibModalInstance.dismiss(reason)
	}

	init()
}
