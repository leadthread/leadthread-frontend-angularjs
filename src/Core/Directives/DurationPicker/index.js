import _ from "lodash"

export const key = "durationPicker"

export const inject = null

export const fn = () => {
	return {
		restrict: "EA",
		template: require("./index.html"),
		scope: {
			ngModel: "=",
			as: "=?",
			min: "@?",
			max: "@?",
		},
		link: function ($scope) {
			function init() {
				//values
				$scope.intervals = getIntervals()
				$scope.as =
					_.indexOf($scope.intervals, $scope.as) >= 0
						? $scope.as
						: _.first($scope.intervals)
				$scope.interval = _.first($scope.intervals)
				$scope.value = $scope.ngModel

				//funcs
				$scope.intervalSelect = intervalSelect

				//listeners
				$scope.$watch("value", function () {
					$scope.ngModel = reduce(
						$scope.value,
						$scope.interval,
						$scope.as
					)
				})
				$scope.$watch("interval", function () {
					$scope.ngModel = reduce(
						$scope.value,
						$scope.interval,
						$scope.as
					)
				})
			}

			function getIntervals() {
				var x = [
					"milliseconds",
					"seconds",
					"minutes",
					"hours",
					"days",
					"weeks",
					"months",
					"years",
				]
				var min = _.indexOf(x, $scope.min)
				var max = _.indexOf(x, $scope.max)

				min = min >= 0 ? min : 0
				max = max >= 0 ? max : x.length - 1

				return _.slice(x, min, max + 1)
			}

			function intervalSelect(x) {
				$scope.interval = x
			}

			function reduce(x, interval, target) {
				x = parseInt(x)

				if (!_.isInteger(x)) {
					return 0
				}

				if (interval === target) {
					return x
				}

				switch (interval) {
					case "years":
						if (target === "months")
							return reduce(x * 12, "months", target)
						if (target === "weeks")
							return reduce(x * 52, "weeks", target)
						if (target === "days")
							return reduce(x * 365, "days", target)
						break
					case "months":
						if (target === "weeks")
							return reduce(x * 4, "weeks", target)
						if (target === "days")
							return reduce(x * 30, "days", target)
						break
					case "weeks":
						return reduce(x * 7, "days", target)
					case "days":
						return reduce(x * 24, "hours", target)
					case "hours":
						return reduce(x * 60, "minutes", target)
					case "minutes":
						return reduce(x * 60, "seconds", target)
					case "seconds":
						return reduce(x * 1000, "milliseconds", target)
					case "milliseconds":
						break
				}

				throw "Could not get from " + interval + " to " + target
			}

			init()
		},
	}
}
