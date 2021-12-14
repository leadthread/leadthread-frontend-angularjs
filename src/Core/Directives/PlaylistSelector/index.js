/* global _:false */
export const key = "playlistSelector"

export const inject = ["$api", "$http", "$device", "$color", "$cache", "$auth"]

export const fn = ($api, $http, $device, $color, $cache, $auth) => {
	return {
		restrict: "EA",
		templateUrl: "components/playlist-selector/index.html",
		scope: {
			playlists: "=",
			model: "=",
			type: "@?",
			placeholder: "@?",
		},
		// require: "uiSelect",
		link: function ($scope, $el, attrs, $select) {
			/**
			 * is run on directive construction
			 * @return undefined
			 */
			function init() {
				defineScope()
				defineListeners()
			}

			/**
			 * defines scope level variables
			 * @return undefined
			 */
			function defineScope() {
				$scope.playlist = { selected: $scope.model }
				$scope.groupPlaylist = groupPlaylist
				$scope.assignModel = assignModel
				$scope.searchEnabled = isDesktop()
				$scope.playlists = _.isArray($scope.playlists)
					? $scope.playlists
					: []
				$scope.auth_id = $auth.getUserId()
			}

			/**
			 * defines listeners for this directive
			 * @return undefined
			 */
			function defineListeners() {}

			function isDesktop() {
				return $device.isDesktop()
			}

			/**
			 * convert item type to human readable string
			 * @param  {object} item object with type property
			 * @return {string}      Human readable string version of type property
			 */
			function groupPlaylist(item) {
				switch (item.type) {
					case "date":
						return "Date"
					case "timer":
						return "Timer"
					default:
						return "Other"
				}
			}

			/**
			 * assigns select item to scope model
			 * @param  {object} item object to assign to $scope.model
			 * @return {undefined}      [description]
			 */
			function assignModel(item) {
				$scope.model = item
			}

			init()
		},
	}
}
