import _ from "lodash"

export const key = "PopupCopyController"

export const inject = ["options", "$scope", "$uibModalInstance"]

export function fn(options, $scope, $uibModalInstance) {
	function init() {
		defineScope()
		defineListeners()

		$scope.model = options.model
		$scope.targets = options.targets

		$scope.result = {
			name: "Copy of " + $scope.model.name,
			target: options.target || null,
			subject: $scope.model,
		}

		if ($scope.targets.length === 1) {
			$scope.result.target = _.first($scope.targets)
		}
	}

	function defineScope() {
		$scope.ok = ok
		$scope.cancel = cancel
		$scope.options = options
	}

	function defineListeners() {}

	function ok(valid) {
		if (valid) {
			$uibModalInstance.close($scope.result)
		}
	}

	function cancel(reason) {
		reason = reason || "cancel"
		$uibModalInstance.dismiss(reason)
	}

	init()
}
