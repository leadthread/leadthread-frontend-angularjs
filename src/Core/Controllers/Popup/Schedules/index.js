import moment from "moment"
import _ from "lodash"

export const key = "PopupPlaylistSchedulesController"

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

		$scope.type = _.get($scope, "options.playlist.type")
		if (!$scope.type) {
			throw "Unknown Playlist type!"
		}

		$scope.options.schedule = _.defaultTo($scope.options.schedule, {})
		$scope.options.schedule._campaign = _.find(
			_.get($scope, "options.campaigns", []),
			{ id: _.get($scope, "options.schedule.campaign_id") }
		)

		var date_send_at = _.get($scope, "options.schedule.date_send_at")
		$scope.options.schedule.date_send_at = date_send_at
			? moment(date_send_at)
			: moment()

		var timer_time = _.get($scope, "options.schedule.timer_time")
		$scope.options.schedule._timer_time = timer_time
			? moment(timer_time, "HH:mmZZ")
			: moment()

		var timer_days = _.get($scope, "options.schedule.timer_days", 0)
		$scope.options.schedule.timer_days = timer_days
	}

	function defineListeners() {}

	function getDataFromForm() {
		var schedule = $scope.options.schedule
		schedule.campaign_id = _.get(schedule, "_campaign.id")
		schedule.date_send_at =
			$scope.type === "date"
				? moment(schedule.date_send_at).format("YYYY-MM-DD HH:mm:ssZZ")
				: null
		schedule.timer_time =
			$scope.type === "timer"
				? moment(schedule._timer_time).format("HH:mmZZ")
				: null
		schedule.timer_days =
			$scope.type === "timer" ? schedule.timer_days : null
		delete schedule._campaign
		delete schedule._timer_time

		return schedule
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
