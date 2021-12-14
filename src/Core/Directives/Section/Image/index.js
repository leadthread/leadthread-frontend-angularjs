import _ from "lodash"

export const key = "sectionImage"

export const inject = ["$api"]

export const fn = ($api) => {
	return {
		restrict: "A",
		templateUrl: "components/section/image/index.html",
		scope: {
			model: "=sectionImage",
		},
		link: function ($scope) {
			function init() {
				if (!$scope.model.file) {
					$scope.model.file = {}
				}

				if (
					$scope.model.type === "image" &&
					!$scope.model.file.id &&
					$scope.model.id
				) {
					$api.show("sections", $scope.model.id)
						.index("files")
						.exec()
						.then(function (resp) {
							$scope.model.file = _.first(resp.data) || {}
							return resp.data
						})
				}

				$scope.$watch(
					function () {
						return _.get($scope, "model.file.id", null)
					},
					function (n) {
						$scope.model.file_id = n
					}
				)
			}

			init()
		},
	}
}
