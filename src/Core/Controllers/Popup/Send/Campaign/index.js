export const key = "PopupSendCampaignController"

export const inject = ["options", "$scope", "$uibModalInstance"]

export const fn = (options, $scope, $uibModalInstance) => {
	function init() {
		defineScope()
		defineListeners()
	}

	function defineScope() {
		$scope.okPrimary = okPrimary
		$scope.cancel = cancel
		$scope.options = options
		$scope.options.placeholders = {
			"Company Name": "Company",
			"Sales Rep Full Name": "Sales Rep Full Name",
			"Sales Rep First Name": "Sales Rep First Name",
			"Sales Rep Last Name": "Sales Rep Last Name",
			"Customer Full Name": "Customer Full Name",
			"Customer First Name": "Customer First Name",
			"Customer Last Name": "Customer Last Name",
		}
	}

	function defineListeners() {}

	function okPrimary(valid) {
		if (valid) {
			$uibModalInstance.close({
				message: options.campaign.contact_text_message,
			})
		}
	}

	function cancel(reason) {
		reason = reason || "cancel"
		$uibModalInstance.dismiss(reason)
	}

	init()
}
