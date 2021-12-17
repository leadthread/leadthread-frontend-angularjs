import _ from "lodash"

const key = "ReportUserController"

const inject = ["$scope", "company_id"]

function fn($scope, company_id) {
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
		var enable = [
			"campaign_id",
			"campaign_type",
			"contact_incentive_views",
			"contact_opened",
			"contact_sent",
			"contact_shares",
			"date",
			"recipient_clicked_total",
			"recipient_opens",
			"recipient_watched_video",
			"recipient_is_lead_total",
			"user_id",
		]
		_.forEach($scope.controls, function (control) {
			var x = _.includes(enable, control.id)
			control.view = x
			control.enabled = x
		})

		// Columns to include but not show a control for
		var view = ["user", "campaign"]
		_.forEach($scope.controls, function (control) {
			var x = _.includes(view, control.id)
			if (x) {
				control.view = x
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
	}

	var defineListeners = function () {}

	var getReportUrlParts = function () {
		return ["/report/event"]
	}

	var fixColumnName = function (column) {
		var name = $scope.report.getNameForColumn(column)
		return name
	}

	init()
}

export const CompanyReportUser = {
	key,
	inject,
	fn,
}
