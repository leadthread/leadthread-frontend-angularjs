import moment from "moment"
import _ from "lodash"

export const key = "PopupSendPlaylistController"

export const inject = [
	"options",
	"$scope",
	"$uibModalInstance",
	"$q",
	"PlaylistScheduleService",
	"CampaignService",
]

export const fn = (
	options,
	$scope,
	$uibModalInstance,
	$q,
	PlaylistScheduleService,
	CampaignService
) => {
	function init() {
		defineScope()
		defineListeners()
		compileSchedules()
	}

	function defineScope() {
		$scope.okPrimary = okPrimary
		$scope.okSecondary = okSecondary
		$scope.cancel = cancel
		$scope.options = options
		$scope.getIndexOfNextSchedule = getIndexOfNextSchedule
		$scope.getNextSchedule = getNextSchedule
		$scope.hasNextSchedule = hasNextSchedule
	}

	function defineListeners() {}

	function compileSchedules() {
		$scope.loading = true
		return PlaylistScheduleService.indexFor(
			"playlists",
			$scope.options.playlist.id
		).then(function (schedules) {
			var campaignIds = _.map(schedules, "campaign_id")
			var campaigns = _.map(campaignIds, function (campaignId) {
				return CampaignService.show(campaignId)
			})

			return $q.all(campaigns).then(function (campaigns) {
				$scope.options.playlist.schedules = _(schedules)
					.map(compileScheduleDate)
					.map(compileScheduleTense)
					.map(function (schedule) {
						schedule.campaign = _.find(campaigns, {
							id: schedule.campaign_id,
						})
						return schedule
					})
					.value()
				$scope.loading = false

				return $scope.options.playlist
			})
		})
	}

	function hasNextSchedule() {
		return _.isObject(getNextSchedule())
	}

	function getNextSchedule() {
		return _($scope.options.playlist.schedules)
			.filter({ tense: "future" })
			.first()
	}

	function getIndexOfNextSchedule() {
		var first = getNextSchedule()
		return _.findIndex($scope.options.playlist.schedules, {
			id: first.id,
		})
	}

	function compileScheduleDate(schedule) {
		if ($scope.options.playlist.type === "date") {
			schedule.date = moment(schedule.date_send_at)
		} else {
			schedule.date = moment(schedule.timer_time, "HH:mm:ssZ").add(
				schedule.timer_days,
				"days"
			)
			if (schedule.date.isBefore(moment())) {
				schedule.date.add(1, "days")
			}
		}

		return schedule
	}

	function compileScheduleTense(schedule) {
		var now = moment()
		if (schedule.date.isBefore(now)) {
			schedule.tense = "past"
		} else {
			schedule.tense = "future"
		}
		return schedule
	}

	function okPrimary(valid) {
		if (valid) {
			$uibModalInstance.close({ asap: false })
		}
	}

	function okSecondary(valid) {
		if (valid) {
			$uibModalInstance.close({ asap: true })
		}
	}

	function cancel(reason) {
		reason = reason || "cancel"
		$uibModalInstance.dismiss(reason)
	}

	init()
}
