export const key = "PromptBuilderCustomController"

export const inject = ["$scope", "Prompt", "$uibModalInstance"]

export function fn($scope, Prompt, $uibModalInstance) {
	function init() {
		defineScope()
		defineListeners()
	}

	function defineScope() {
		$scope.prompt = new Prompt()
	}

	function defineListeners() {}

	$scope.done = function () {
		$uibModalInstance.close($scope.prompt)
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss("cancel")
	}

	init()
}
