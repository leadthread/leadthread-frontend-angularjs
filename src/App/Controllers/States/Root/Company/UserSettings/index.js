const key = "UserSettingsController"

const inject = ["$scope", "$auth", "$api", "$notification"]

function fn($scope, $auth, $api, $notification) {
	/**
	 * init function runs on creation
	 */
	function init() {
		defineScope()
		defineListeners()
	}

	/**
	 * Define Scope level variables
	 */
	function defineScope() {
		$scope.user = $auth.getUser()
		$scope.oldPass = ""
		$scope.newPass = ""
		$scope.confPass = ""
		$scope.save = save
		$scope.validatePassword = validatePassword
		$scope.validateUser = validateUser
		$scope.error = null
		$scope.isValid = true
		if ($scope.user.file_id) {
			$api.show("files", $scope.user.file_id)
				.exec()
				.then(function (res) {
					$scope.profilePic = res.data
				})
		} else {
			$scope.profilePic = {}
		}
	}

	/**
	 * defines listeners needed in this state
	 */
	function defineListeners() {}

	function validateUser() {
		var res = true
		if (!$scope.user.first_name) {
			$scope.error = "first-name"
			res = false
		} else if (!$scope.user.last_name) {
			$scope.error = "last-name"
			res = false
		} else if (!$scope.user.email) {
			$scope.error = "email"
			res = false
		} else if (
			!$scope.user.phone ||
			!/^\+?1?[0-9]{10}$/.test($scope.user.phone)
		) {
			$scope.error = "phone"
			res = false
		}

		$scope.isValid = res

		if ($scope.isValid) {
			$scope.error = null
		}
	}

	/**
	 * Makes sure that the new password is valid
	 * @return {boolean} is password valid
	 */
	function validatePassword() {
		var res = true

		// check for null password
		if ($scope.oldPass) {
			// check old password
			// compare new passwords
			if ($scope.newPass !== $scope.confPass) {
				$scope.error = "pass-mismatch"
				res = false
			} else if (!$scope.confPass && !$scope.newPass) {
				res = false
				$scope.error = "pass-invalid"
			} else if (!$scope.newPass) {
				res = false
				$scope.error = "pass-invalid"
			} else if (!$scope.confPass) {
				res = false
				$scope.error = "pass-mismatch"
			}
		} else if ($scope.newPass || $scope.confPass) {
			$scope.error = "pass-wrong"
			res = false
		}

		$scope.isValid = res

		if ($scope.isValid == true) {
			$scope.error = null
		}
	}

	/**
	 * Saves updated user information to the database
	 * @return {promise}
	 */
	function save() {
		if ($scope.isValid) {
			if ($scope.profilePic !== {}) {
				$scope.user.file_id = $scope.profilePic.id
			}
			if ($scope.newPass) {
				$scope.user.password = $scope.newPass
				$scope.user.password_old = $scope.oldPass
				$scope.user.password_confirm = $scope.confPass
			}
			return $api
				.update("users", $scope.user)
				.exec()
				.then(
					function (resp) {
						$notification.success("Saved Settings")
						var newUser = resp.data
						if (newUser.id === $auth.getUser().id) {
							$auth.setUser(newUser)
							$scope.user = newUser
						}
					},
					function () {
						$notification.error("Unable to Save Settigns")
					}
				)
		}
	}

	init()
}

export const CompanyUserSettings = {
	key,
	inject,
	fn,
}
