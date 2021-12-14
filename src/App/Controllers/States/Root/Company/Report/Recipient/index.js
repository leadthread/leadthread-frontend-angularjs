import _ from "lodash"

const key = "ReportRecipientController"

const inject = ["$scope", "company_id"]

const fn = ($scope, company_id) => {
	/**
	 * Start it up
	 */
	function init() {
		defineScope()
		defineListeners()
		$scope.report.load()
	}

	var defineScope = function () {
		$scope.companyId = company_id

		// Columns to include and show a control for
		var both = [
			"campaign_id",
			"campaign_type",
			"date",
			"recipient_clicked_call",
			"recipient_clicked_email",
			"recipient_clicked_register",
			"recipient_clicked_sms",
			"recipient_clicked_url",
			"recipient_opens",
			"recipient_watched_video",
			"recipient_is_lead",
			"user_id",
		]
		_.forEach($scope.controls, function (control) {
			var x = _.includes(both, control.id)
			control.view = x
			control.enabled = x
		})

		// Columns to include but not show a control for
		var view = [
			"user",
			"campaign",
			"contact",
			"recipient",
			"recipient_phone",
			"recipient_email",
			"campaign_id",
			"user_id",
			"contact_id",
			"recipient_id",
		]
		_.forEach($scope.controls, function (control) {
			var x = _.includes(view, control.id)
			if (x) {
				control.view = x
			}
		})

		// Columns to include but not show a control or a column
		var include = ["recipient_is_relevant"]
		_.forEach($scope.controls, function (control) {
			var x = _.includes(include, control.id)
			if (x) {
				control.include = x
			}
		})

		//Report Values
		$scope.report.setTabByState()
		$scope.report.showSums = true
		$scope.report.data = null

		//Selected
		$scope.report.setSelectedFromStateParams()

		//Report Functions
		$scope.report.getReportUrlParts = getReportUrlParts
		$scope.report.fixColumnName = fixColumnName

		// Set a default value
		$scope.selected.recipient = null
		$scope.selected.recipient_is_relevant = "yes"
	}

	var defineListeners = function () {}

	var getReportUrlParts = function () {
		return ["/report/event"]
	}

	var fixColumnName = function (column) {
		var name = $scope.report.getNameForColumn(column)

		return name.replace("Referral ", "").replace("Recipient ", "")
	}

	init()
}

export const CompanyReportRecipient = {
	key,
	inject,
	fn,
}
