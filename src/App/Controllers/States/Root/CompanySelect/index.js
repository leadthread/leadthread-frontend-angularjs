import _ from "lodash"
import Controller from "../../Controller"

class CompanySelectController extends Controller {
	static $inject = [
		"$scope",
		"$q",
		"$api",
		"$state",
		"$auth",
		"$cache",
		"CompanyService",
		"$httpParamSerializer",
	]
	constructor(
		$scope,
		$q,
		$api,
		$state,
		$auth,
		$cache,
		CompanyService,
		$httpParamSerializer
	) {
		super()
		this.onSearchChange = _.throttle(this.onSearchChange, 1000, {
			leading: false,
			trailing: true,
		})
	}

	defineScope() {
		this.$scope.loading = null
		this.$scope.onPageChange = this.onPageChange
		this.$scope.logout = this.logout
		this.$scope.search = { name: "" }
		this.$scope.companies = []
		this.$scope.showDisabledAt = this.showDisabledAt
		this.$scope.selectCompany = this.selectCompany
		this.$scope.favicons = {}
		this.$scope.pagination = {
			page: 1,
			limit: 24,
			total: 0,
		}
	}

	defineListeners() {
		this.$scope.$watch("search.name", () => {
			return this.onSearchChange(this.$scope.search)
		})
	}

	load = (page = 1) => {
		this.$scope.loading = "Loading"
		this.$scope.companies = []
		let user_id = this.$auth.getUserId()
		let pagination = this.$scope.pagination
		let searchName = this.$scope.search.name
		let params = _.merge({}, this.$scope.search)
		let promise = this.CompanyService.paginate(
			pagination.page,
			pagination.limit,
			params
		)

		promise.then((x) => {
			let promises = _.map(x.data, (c) => {
				return c.load(true)
			})

			return this.$q.all(promises).then((companies) => {
				_.forEach(companies, (c) => {
					let fingerprint = _.get(c, "brand.favicon.fingerprint")
					if (fingerprint) {
						this.$scope.favicons[c.id] =
							"/files/" + fingerprint + "/stretch/64/64"
					}
				})
				return x
			})
		})

		return promise.then((x) => {
			if (searchName == this.$scope.search.name) {
				this.$scope.loading = null
				this.$scope.companies = x.data
				this.$scope.pagination.total = x.meta.total
			}
			return x
		})
	}

	showDisabledAt(company) {
		return _.get(company, "disabled_at", null)
	}

	selectCompany = (id) => {
		this.$scope.loading = "Loading"
		this.$state.go("root.company.dashboard", { companyId: id })
	}

	logout = () => {
		return this.$auth.logout()
	}

	onPageChange = (page) => {
		this.load(page)
	}

	onSearchChange = (search) => {
		this.load(1)
	}

	init() {
		this.onPageChange(1)
		this.$auth.isSuperAdmin().then((isSuperAdmin) => {
			this.$scope.isSuperAdmin = isSuperAdmin
		})
	}
}

const key = "CompanySelectController"
const fn = CompanySelectController

export const CompanySelect = {
	key,
	fn,
}
