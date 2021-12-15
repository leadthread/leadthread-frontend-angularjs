import _ from "lodash"

class RunningRequests {
	static _requests = {}
	static get(key) {
		return RunningRequests._requests[key]
	}

	static set(key, value) {
		RunningRequests._requests[key] = value
	}

	static remove(key) {
		delete RunningRequests._requests[key]
	}
}

class Request {
	_includeDeleted = false
	_root = "api/v1"

	_method = []
	_path = []
	_resource = []
	_resource_id = []
	_action = []
	_params = {}

	constructor($http, $httpParamSerializer, $httpPreload) {}

	set includeDeleted(x) {
		this._includeDeleted = x
	}

	set path(x) {
		if (x) {
			this._path.push(x)
		}
	}
	get path() {
		return "/" + [this._root].concat(this._path).join("/")
	}

	set method(x) {
		this._method.push(x)
	}
	get method() {
		return _.last(this._method)
	}

	set action(x) {
		this._action.push(x)
	}
	get action() {
		return _.last(this._action)
	}

	set resource(x) {
		this._resource.push(x)
	}
	get resource() {
		return _.last(this._resource)
	}

	set resource_id(x) {
		if (x) {
			this._resource_id.push(x)
		}
	}
	get resource_id() {
		if (this._resource_id.length === this._resource.length) {
			return _.last(this._resource_id)
		}
		return null
	}

	set params(x) {
		if (_.isPlainObject(x)) {
			this._params = _.merge(this._params, x)
		}
	}
	get params() {
		return this._params
	}

	add(action, resource, resource_id = null, params = null) {
		this.action = action
		this.method = this.getMethodForAction(action)
		this.resource = resource
		this.resource_id = resource_id
		this.params = params
		this.path = resource
		this.path = resource_id
	}

	/**
	 * Checks for any pre-existing api requests and returns the duplicate or a new request
	 */
	exec(canceler = null) {
		let config = this.buildHttpRequestConfig(canceler)

		if (this.method !== "GET") {
			let promise = this.$http(config).then((x) => {
				return x.data
			})

			if (_.includes(["DELETE", "POST", "PUT"], this.method)) {
				promise.then((x) => {
					this.$httpPreload.removeAll()
					return x
				})
			}

			return promise
		}

		// Process GET requests and check for duplicates
		let key = this.toString()
		let request = RunningRequests.get(key)

		if (!(request && !config.timeout)) {
			// Create a new http request
			request = this.$http(config).then((x) => {
				RunningRequests.remove(key)
				return x.data
			})

			if (!config.timeout) {
				RunningRequests.set(key, request)
			}
		}

		return request
	}

	/**
	 * Makes an HTTP request
	 */
	buildHttpRequestConfig(canceler = null) {
		let request = {
			method: this.method,
			url: this.path,
			cache: this.$httpPreload,
		}

		if (request.method == "GET") {
			if (this._includeDeleted) {
				this.params = { _deleted: true }
			}
			request.params = this.params
		} else {
			request.data = this.params
		}

		if (canceler) {
			request.timeout = canceler.promise
		}

		return request
	}

	getMethodForAction(action) {
		switch (action) {
			case "index":
			case "show":
			case "count":
			case "paginate":
				return "GET"
			case "store":
				return "POST"
			case "update":
				return "PUT"
			case "destroy":
				return "DELETE"
			default:
				throw "Unknown action: " + action
		}
	}

	toString() {
		let params = this.$httpParamSerializer(this.params)
		return this.path + (params === "" ? "" : "?" + params)
	}
}

class ApiService {
	static existing = []

	_request = null

	static $inject = ["$http", "$httpParamSerializer", "$httpPreload"]
	constructor($http, $httpParamSerializer, $httpPreload) {}

	get request() {
		this._request = this._request
			? this._request
			: new Request(
					this.$http,
					this.$httpParamSerializer,
					this.$httpPreload
			  )
		return this._request
	}

	index = (resource, params = {}) => {
		this.request.add("index", resource, null, params)
		return this
	}
	paginate = (resource, page = 1, limit = 24, params = {}) => {
		params = !params ? {} : params
		params.page = page
		params.limit = limit
		this.request.add("paginate", resource, null, params)
		return this
	}
	count = (resource, params = {}) => {
		this.request.add("count", resource, "count", params)
		return this
	}
	show = (resource, id, params = {}) => {
		this.request.add("show", resource, id + "", params)
		return this
	}
	store = (resource, model) => {
		if (model.id) {
			return this.update(resource, model)
		}
		this.request.add("store", resource, null, model)
		return this
	}
	update = (resource, model) => {
		if (!model.id) {
			return this.store(resource, model)
		}
		this.request.add("update", resource, model.id + "", model)
		return this
	}
	destroy = (resource, id, params = {}) => {
		this.request.add("destroy", resource, id + "", params)
		return this
	}
	withDeleted = (include = true) => {
		this.request.includeDeleted = include
		return this
	}
	reset() {
		this._request = null
	}
	exec(minutes, canceler) {
		let response = this.request.exec(canceler)

		this.reset()

		return response
	}
}

export const key = "$api"
export const inject = null
export const fn = ApiService
