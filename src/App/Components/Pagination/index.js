import _ from "lodash"
import Controller from "../../Controller"
import Component from "../../../Core/Components/Component"

class PaginationController extends Controller {
	static $inject = ["$q"]

	//Bindings
	service
	params
	models
	pagination
	loading
	id
	related

	constructor($q) {
		super()
		this.loading = null
		this.id = "pagination-" + Math.round(Math.random() * 1000)
		this.pagination = {
			page: 1,
			limit: 20,
			total: 0,
		}
	}

	$onChanges(changes) {
		let params = _.get(changes, "params.currentValue", null)
		if (params) {
			this.params = params
			this.load(1, this.params)
		}
	}

	run = () => {
		this.load(this.pagination.page, this.params)
	}

	onPageChange(page) {
		this.load(page, this.params)
	}

	load = (page = 1, params = {}) => {
		this.loading = "Loading..."
		let promise = this.service.paginate(page, this.pagination.limit, params)

		promise.then((x) => {
			let promises = _.map(x.data, (c) => {
				return c.load(this.related)
			})

			return this.$q.all(promises)
		})

		return promise.then((x) => {
			this.loading = null
			this.models = x.data
			this.pagination.total = x.meta.total
			this.pagination.page = page
			return x
		})
	}
}

class PaginationComponent extends Component {
	bindings
	controller
	controllerAs
	template
	transclude

	constructor() {
		super()
		this.bindings = {
			service: "<",
			params: "<",
			related: "<",
		}
		this.transclude = true
		this.controller = PaginationController
		this.controllerAs = "$ctrl"
		this.template = require("./index.html")
	}
}

export const Pagination = {
	key: "pagination",
	fn: new PaginationComponent(),
}
