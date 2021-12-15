import _ from "lodash"

export const inject = [
	"$transitions",
	"$company",
	"$favicon",
	"$state",
	"$auth",
	"$localStorage",
	"$notification",
	"$app",
	"$httpPreload",
]

export const fn = (
	$transitions,
	$company,
	$favicon,
	$state,
	$auth,
	$localStorage,
	$notification,
	$app,
	$httpPreload
) => {
	$transitions.onExit({ exiting: "root.company" }, function () {
		$app.COMPANY_ID = null
		$httpPreload.removeAll()
		$favicon.resetFavicon()
	})

	$transitions.onBefore({ to: "root.company" }, function () {
		return $state.target("root.company.dashboard")
	})

	$transitions.onBefore({ to: "root.company.**" }, function (trans) {
		var toParams = trans.params("to")
		var companies = trans.injector().getAsync("companies")

		if (!toParams.companyId) {
			return $state.target("root.company-select")
		} else {
			$app.COMPANY_ID = parseInt(toParams.companyId)
		}

		return companies.then(function (companies) {
			var toCompany = _.find(companies, { id: toParams.companyId })
			if (toCompany !== undefined && toCompany.status == "disabled") {
				$notification.error(toCompany.name + " is disabled")
				return $state.target("root.company-select")
			}
		})
	})

	$transitions.onBefore({ to: "root.company.**" }, function (trans) {
		var isAuthorized = false
		var $state = trans.router.stateService
		var roles = trans.to().roles

		return $auth
			.loadRole(_.cloneDeep(trans.params()).companyId)
			.then(function (role) {
				if (_.isArray(roles)) {
					_.forEach(roles, function (x) {
						if (role && x == role.role) {
							isAuthorized = true
						}
					})
				} else {
					isAuthorized = true
				}

				if (!$auth.isLoggedIn() || !isAuthorized) {
					if (trans.to().name !== "root.company.404") {
						$localStorage.set(
							"state-login-target-name",
							trans.to().name
						)
						$localStorage.set(
							"state-login-target-params",
							_.cloneDeep(trans.params())
						)
					}

					if (!$auth.isLoggedIn()) {
						$notification.error("You are not logged in.")
					} else {
						$notification.error(
							"You are not authorized to view that page."
						)
					}

					return $state.target("root.auth.login")
				}
			})
	})
}
