import _ from "lodash"

export const key = "$pages"

export const inject = ["PAGES", "$auth", "$q", "CompanyService", "$app"]

export const fn = (PAGES, $auth, $q, CompanyService, $app) => {
	var all = function () {
		return PAGES
	}

	var get = function () {
		return build()
	}

	var build = function () {
		return $q
			.all({
				company_id: $app.COMPANY_ID,
				count: CompanyService.count().then(function (x) {
					return x.count
				}),
			})
			.then(function (x) {
				var pages = _.cloneDeep(all())
				var roleObj = $auth.getRole(x.company_id)

				if (!_.isEmpty(roleObj)) {
					var role = roleObj.role

					_.forEach(pages, function (page) {
						_.forEach(page.pages, function (page) {
							checkPagePermissions(role, page, x.count)
						})
						checkPagePermissions(role, page, x.count)
					})
					return pages
				} else {
					return _.filter(pages, { sref: ".logout" })
				}
			})
	}

	var checkPagePermissions = function (role, page, count) {
		page.enabled = false
		page.badge = 0

		if (
			_.isArray(page.pages) > 0 &&
			_.filter(page.pages, { enabled: true }).length > 0
		) {
			page.enabled = page.enabled || true
		}

		_.forEach(page.role, function (pageRole) {
			if (
				_.isEqual(pageRole, role) &&
				(!page.onlySingleCompanies || count > 1)
			) {
				page.enabled = page.enabled || true
			} else {
				page.enabled = page.enabled || false
			}
		})
	}

	return {
		all: all,
		get: get,
	}
}
