import _ from "lodash"

export const key = "PopupController"

export const inject = [
	"options",
	"$scope",
	"$timeout",
	"$window",
	"$uibModalInstance",
	"$q",
	"$sce",
	"$auth",
]

export function fn(
	options,
	$scope,
	$timeout,
	$window,
	$uibModalInstance,
	$q,
	$sce,
	$auth
) {
	var okTimeout

	function init() {
		defineScope()
		defineListeners()

		if (options.type === "delay") {
			$timeout.cancel(okTimeout)
			okTimeout = $timeout($scope.ok, options.timeout)
		}

		if (options.type === "while") {
			$q.when(options.promise).then($scope.ok, $scope.cancel)
		}
	}

	function defineListeners() {
		$scope.$on("$stateChangeStart", function () {
			$scope.cancel("State Change Started")
		})
	}

	function defineScope() {
		// funcs
		$scope.ok = ok
		$scope.cancel = cancel
		$scope.showCopyPasteHelper = showCopyPasteHelper
		$scope.getPanelClasses = getPanelClasses

		// data
		$scope.user_id = $auth.getUserId()
		$scope.options = options
		$scope.options.text = $sce.trustAsHtml($scope.options.text)
	}

	function showCopyPasteHelper() {
		return $scope.options._showCopyPasteHelper
	}

	function getPanelClasses() {
		var c = []
		switch ($scope.options.type) {
			case "form":
				c.push("long")
				break
			default:
				c.push("short")
				break
		}
		return c
	}

	function getDataFromForm() {
		var data = true
		if ($scope.options.form) {
			data = {}
			_.forEach($scope.options.form, function (control) {
				data[control.key] = control.value
			})
		}
		return data
	}

	function ok(valid) {
		if (!$scope.options.form || valid) {
			if ($window.isActive()) {
				$uibModalInstance.close(getDataFromForm())
			} else {
				$timeout.cancel(okTimeout)
				okTimeout = $timeout($scope.ok, 1000)
			}
		}
	}

	function cancel(reason) {
		reason = reason || "cancel"
		$uibModalInstance.dismiss(reason)
	}

	init()
}
