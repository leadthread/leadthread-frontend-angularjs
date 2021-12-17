export const key = "PromptBuilderLibraryController"

export const inject = ["$scope", "Prompt", "$uibModalInstance", "$company"]

export function fn($scope, Prompt, $uibModalInstance, $company) {
	function init() {
		defineScope()
		defineListeners()
	}

	function defineScope() {
		$scope.myCue = {}
		$scope.myCue.step = 1
		$scope.prompt = new Prompt()
		$scope.cat
		$scope.option = {}

		$company.getIndustry().then(function (i) {
			$scope.cat = i
		})
	}

	function defineListeners() {
		$scope.$watch(
			function () {
				return $scope.myCue.step
			},
			function () {
				if ($scope.myCue.step == 0) $scope.done()
			}
		)
	}

	$scope.done = function () {
		$uibModalInstance.close($scope.prompt)
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss("cancel")
	}

	init()
}
