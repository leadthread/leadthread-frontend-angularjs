import _ from "lodash"

/* global angular:false */
const key = "ManageController"

const inject = [
	"$scope",
	"users",
	"$auth",
	"$api",
	"$notification",
	"$popup",
	"company_id",
	"roles",
	"$http",
	"$q",
	"UserService",
]

const fn = (
	$scope,
	users,
	$auth,
	$api,
	$notification,
	$popup,
	company_id,
	roles,
	$http,
	$q,
	UserService
) => {
	/**
	 * Start it up
	 */
	function init() {
		defineScope()
		defineListeners()
	}

	var defineScope = function () {
		$scope.users = users
		$scope.deleteUser = deleteUser
		$scope.addUser = addUser
		$scope.stringified = JSON.stringify($scope.users)
		$scope.userId = $auth.getUserId()
	}

	var defineListeners = function () {
		$scope.$watch(function () {
			return JSON.stringify($scope.users)
		}, onUsersChange)
	}

	var onUsersChange = _.debounce(function (n, o) {
		if (n !== o && $scope.stringified !== n) {
			n = JSON.parse(n)
			o = JSON.parse(o)
			_.forEach(n, function (nUser) {
				_.forEach(o, function (oUser) {
					if (
						nUser.id === oUser.id &&
						!angular.equals(nUser, oUser)
					) {
						var user = _.find($scope.users, { id: nUser.id })
						updateUser(user)
					}
				})
			})
		}
	}, 2000)

	var deleteUser = function (user) {
		return $q(function (resolve, reject) {
			if (user.id == $scope.userId) {
				var msg = "Cannot delete yourself"
				$notification.error(msg)
				reject(msg)
			} else {
				$popup
					.decide(
						"Are you sure you want to delete " +
							user.first_name +
							" " +
							user.last_name +
							"?",
						"This action cannot be undone."
					)
					.then(function () {
						UserService.destroy(user.id).then(function (response) {
							if (response) {
								_.remove($scope.users, function (n) {
									return n.id === user.id
								})
							}
							return response
						}, reject)
					}, reject)
			}
		})
	}

	var updateUser = function (user) {
		saveUser(user)
	}

	var addUser = function () {
		var model = {}
		return $popup
			.form(
				[
					{
						type: "input",
						subtype: "text",
						label: "First Name",
						key: "first_name",
						value: model.first_name,
						required: true,
					},
					{
						type: "input",
						subtype: "text",
						label: "Last Name",
						key: "last_name",
						value: model.last_name,
						required: true,
					},
					{
						type: "input",
						subtype: "tel",
						label: "Phone",
						key: "phone",
						value: model.phone,
						required: true,
					},
					{
						type: "input",
						subtype: "text",
						label: "Email",
						key: "email",
						value: model.email,
						required: true,
					},
					{
						type: "select",
						subtype: "null",
						label: "Role",
						key: "role",
						value: model.role,
						required: true,
						choices: { User: "User", Admin: "Admin" },
					},
				],
				"Who is this?"
			)
			.then(saveUser)
	}

	function saveUser(resp) {
		var model = resp
		var role = _.find(roles, function (o) {
			return o.name == resp.role
		})
		model.company_id = company_id
		model.role_id = role.id

		return UserService.save(model).then(function (resp) {
			var nUser = resp
			nUser.role = role.name

			var index = _.indexOf(
				$scope.users,
				_.find($scope.users, function (u) {
					return u.id === nUser.id
				})
			)

			if (index !== -1) {
				for (var key in nUser) {
					if (key !== "updated_at") {
						$scope.users[index][key] = nUser[key]
					}
				}
			} else {
				$scope.users.push(nUser)
			}
			$notification.success("Saved!")
		})
	}

	init()
}

export const CompanyManage = {
	key,
	inject,
	fn,
}
