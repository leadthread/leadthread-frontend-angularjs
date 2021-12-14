export const key = "PopupIncentiveController"

export const inject = ["options", "$scope", "$uibModalInstance"]

export const fn = (options, $scope, $uibModalInstance) => {
	function init() {
		defineScope()
		defineListeners()
	}

	function defineScope() {
		$scope.ok = ok
		$scope.cancel = cancel
		$scope.options = options
	}

	function defineListeners() {}

	function getDataFromForm() {
		return true
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
