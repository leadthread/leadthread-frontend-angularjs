import _ from "lodash"

export const key = "jobOverlay"

export const inject = ["$job"]

export const fn = ($job) => {
	return {
		restrict: "EA",
		templateUrl: "components/job/index.html",
		link: function ($scope) {
			var init = function () {
				defineScope()
				defineListeners()
			}

			var defineScope = function () {
				$scope.jobs = $job.all
				$scope.getClass = getClass
				$scope.getValue = getValue
				$scope.getType = getType
				$scope.getHumanPercentage = getHumanPercentage
			}

			var defineListeners = function () {}

			var getHumanPercentage = function (job) {
				return _.indexOf(["waiting", "failed"], job.status) >= 0
					? ""
					: Math.round(job.progress * 100) + "%"
			}

			var getClass = function (job) {
				return _.indexOf(["waiting"], job.status) >= 0
					? "progress-striped active"
					: ""
			}

			var getValue = function (job) {
				return _.indexOf(["waiting", "failed"], job.status) >= 0
					? 1
					: job.progress
			}

			var getType = function (job) {
				switch (job.status) {
					case "succeeded":
						return "success"
					case "failed":
						return "danger"
					default:
						return "primary"
				}
			}

			init()
		},
	}
}
