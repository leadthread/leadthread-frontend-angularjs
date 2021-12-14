import _ from "lodash"

export const key = "notesDirective"

export const inject = ["$api", "$popup", "$notification", "$q"]

export const fn = ($api, $popup, $notification, $q) => {
	return {
		restrict: "EA",
		templateUrl: "components/notes/index.html",
		scope: {
			user: "=",
			notableId: "=",
			notableType: "=",
			notes: "=?",
		},
		link: function ($scope) {
			var init = function () {
				defineScope()
				defineListeners()
			}

			var defineScope = function () {
				$scope.addNote = addNote
				$scope.getDate = getDate
				fetchNotes()
			}

			var fetchNotes = function () {
				if ($scope.notableId) {
					$api.index("notes", {
						notable_id: $scope.notableId,
						notable_type: $scope.notableType,
					})
						.exec()
						.then(function (resp) {
							var notes = resp.data
							var userIds = _(notes).map("user_id").uniq().value()
							if (userIds.length > 0) {
								_.forEach(userIds, function (user_id) {
									$api.show("users", user_id)
										.exec()
										.then(function (resp) {
											var users = resp.data
											if (!_.isArray(users)) {
												users = [users]
											}
											_.forEach(users, function (user) {
												_.forEach(
													_.filter(notes, {
														user_id: user.id,
													}),
													function (n) {
														n.user_name =
															user.first_name +
															" " +
															user.last_name
													}
												)
											})
											$scope.notes = notes
										})
								})
							} else {
								$scope.notes = []
							}
						}, console.error)
				} else {
					$scope.notes = []
				}
			}

			var defineListeners = function () {
				$scope.$watch("notableId", fetchNotes)
			}

			var getDate = function (d) {
				return new Date(d)
			}

			/**
			 * adds a note to referral
			 */
			function addNote() {
				$popup
					.textarea("note", "", "Add Your Note Below")
					.then(function (resp) {
						var note = {
							user_id: $scope.user.id,
							// user_name: $scope.user.first_name+" "+$scope.user.last_name,
							note: resp.note,
							notable_id: $scope.notableId,
							notable_type: $scope.notableType,
						}

						$api.store("notes", note)
							.exec()
							.then(
								function (res) {
									res = res.data
									res.user_name =
										$scope.user.first_name +
										" " +
										$scope.user.last_name
									$scope.notes.push(res)
								},
								function () {
									$notification.error(
										"Your note could not be saved."
									)
								}
							)
					}, console.error)
			}

			init()
		},
	}
}
