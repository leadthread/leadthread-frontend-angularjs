///
import _ from "lodash"

export class Model {
	id
	created_at
	updated_at

	constructor(_service, _data) {
		this._service = _service
		this.set(_data)
	}

	load(include = null) {
		return this._service.load(this, include)
	}

	save(include = null) {
		return this._service.save(this, include)
	}

	destroy() {
		return this._service.destroy(this.id)
	}

	valueOf() {
		let x = {}
		_.forEach(this.getAttributes(), (a) => {
			let y = this
			x[a] = y[a]
		})
		return x
	}

	toString() {}

	getAttributes() {
		let properties = []

		for (var propertyName in this) {
			if (
				["number", "string", "boolean"].indexOf(
					typeof this[propertyName]
				) >= 0 ||
				propertyName.indexOf("_id") >= 0
			) {
				properties.push(propertyName)
			}
		}

		_.pull(properties, "$$hashKey")

		return properties
	}

	set(_data) {
		_data = _.merge(this.getDefaults(), _data)

		_.forIn(_data, (value, key) => {
			let self = this
			self[key] = value
		})
	}

	getDefaults() {
		return _.cloneDeep({})
	}
}

export class ModelFactory {
	static $inject = ["ModelService"]
	constructor(_service) {
		this._service = _service
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class ModelService {
	resource
	relatedRelatedIndex

	static $inject = []
	constructor() {
		this.related = {
			load: {},
			save: {
				before: {},
				after: {},
			},
		}
	}

	/**
	 * Creates an instance of the Model but does not save it to the database
	 * @param  {IModel} _data [description]
	 * @return {Model}       [description]
	 */
	create = () => {
		throw "create() not implemented for " + this.resource
	}

	beforeSave(model) {
		return model
	}

	afterSave(model) {
		return model
	}

	save(orig, include = null) {
		return this.saveRelatedBefore(orig, include)
			.then(() => {
				orig = this.beforeSave(orig)

				if (!orig) {
					return this.$q.when(null)
				}

				if (_.isNumber(orig.id)) {
					return this.$api
						.update(this.resource, orig.valueOf())
						.exec()
				} else {
					return this.$api.store(this.resource, orig.valueOf()).exec()
				}
			})
			.then((fresh) => {
				return _.merge(orig, fresh.data)
			})
			.then(this.afterSave)
			.then((fresh) => {
				return this.$q
					.when(this.saveRelatedAfter(fresh, include))
					.then(() => {
						return fresh
					})
			})
	}

	saveFor(parentResource, parentId, orig, include) {
		if (_.isNil(parentId)) {
			return this.$q.reject(
				"ID for " +
					parentResource +
					" cannot be Nil when storing its related member: " +
					this.resource
			)
		}

		return this.saveRelatedBefore(orig, include)
			.then(() => {
				orig = this.beforeSave(orig)

				if (_.isNumber(orig.id)) {
					return this.$api
						.show(parentResource, parentId)
						.update(this.resource, orig.valueOf())
						.exec()
						.then(function (x) {
							return x.data
						})
						.then(this.create)
				} else {
					return this.$api
						.show(parentResource, parentId)
						.store(this.resource, orig.valueOf())
						.exec()
						.then(function (x) {
							return x.data
						})
						.then(this.create)
				}
			})
			.then((fresh) => {
				return _.merge(orig, fresh)
			})
			.then(this.afterSave)
			.then((fresh) => {
				return this.$q
					.when(this.saveRelatedAfter(fresh, include))
					.then(() => {
						return fresh
					})
			})
	}

	saveRelated(time, model, include = null) {
		let promises = {},
			relatedSaveDict,
			x

		if (time === "after") {
			x = this.related.save.after
		} else {
			x = this.related.save.before
		}

		relatedSaveDict = this.filterDictionaryKeys(x, include)

		_.forOwn(relatedSaveDict, (fn, prop) => {
			promises[prop] = fn(model, include)
		})

		return this.$q.all(promises)
	}

	saveRelatedAfter(model, include = null) {
		return this.saveRelated("after", model, include)
	}

	saveRelatedBefore(model, include = null) {
		return this.saveRelated("before", model, include)
	}

	load = (model, include) => {
		let promises = {}
		let relatedLoadDict = this.filterDictionaryKeys(
			this.related.load,
			include
		)
		_.forOwn(relatedLoadDict, (fn, prop) => {
			promises[prop] = fn(model).then((x) => {
				if (_.isArray(x)) {
					let y = _.map(x, (i) => {
						return i.load(include)
					})
					return this.$q.all(y).then(() => {
						return x
					})
				} else {
					if (x instanceof Model) {
						return x.load(include)
					} else {
						return x
					}
				}
			})
		})

		return this.$q.all(promises).then(() => {
			return model
		}, this.onApiError)
	}

	onApiError = (e) => {
		console.error(e)
		return this.$q.reject(e)
	}

	paginate(page = 1, limit = 24, params) {
		let x = this.$api.paginate(this.resource, page, limit, params).exec()

		return x.then((r) => {
			if (_.isArray(r.data)) {
				r.data = _.map(r.data, this.create)
				return r
			} else {
				return this.$q.reject("ModelService was expecting an array.")
			}
		})
	}

	index(params) {
		let x = this.$api.index(this.resource, params).exec()
		return x.then((r) => {
			if (_.isArray(r.data)) {
				return _.map(r.data, this.create)
			} else {
				return this.$q.reject("ModelService was expecting an array.")
			}
		})
	}

	indexFor(parentResource, parentId, params) {
		if (_.isNil(parentId)) {
			return this.$q.reject(
				"ID for " +
					parentResource +
					" cannot be Nil when loading its " +
					this.resource
			)
		}

		var x = this.$api
			.show(parentResource, parentId)
			.index(this.resource, params)
			.exec()
		return x.then((r) => {
			if (_.isArray(r.data)) {
				return _.map(r.data, this.create)
			} else {
				return this.$q.reject("ModelService was expecting an array.")
			}
		})
	}

	count(params) {
		return this.$api
			.count(this.resource, params)
			.exec()
			.then(function (x) {
				return x.data
			})
	}

	countFor(parentResource, parentId, params) {
		if (_.isNil(parentId)) {
			return this.$q.reject(
				"ID for " +
					parentResource +
					" cannot be Nil when loading its " +
					this.resource
			)
		}
		return this.$api
			.show(parentResource, parentId)
			.count(this.resource, params)
			.exec()
			.then(function (x) {
				return x.data
			})
	}

	showOrCreate(id, search) {
		if (!id) {
			return this.$q.when(this.create(search))
		}
		return this.show(id).catch(() => {
			return this.create(search)
		})
	}

	show(id) {
		if (_.isNil(id)) {
			return this.$q.reject("ID for " + this.resource + " is Nil")
		}

		let x = this.$api.show(this.resource, id).exec()

		return x.then((y) => {
			return this.create(y.data)
		})
	}

	destroy(id) {
		if (_.isNil(id)) {
			return this.$q.when(true)
		}

		let x = this.$api
			.destroy(this.resource, id)
			.exec()
			.then(function (x) {
				return x.data
			})

		return x
	}

	destroyFor(parentResource, parentId, id) {
		if (_.isNil(parentId)) {
			return this.$q.reject(
				"ID for " +
					parentResource +
					" cannot be Nil when storing its related member: " +
					this.resource
			)
		}

		if (_.isNil(id)) {
			return this.$q.when(true)
		}

		let x = this.$api
			.show(parentResource, parentId)
			.destroy(this.resource, id)
			.exec()
			.then(function (x) {
				return x.data
			})

		return x
	}

	/**
	 * Filters a dictionary to include certain keys, all keys or no keys
	 * @param  {_.Dictionary} dict    The dictionary to be filtered
	 * @param  {string}  include true: include all keys. false: include no keys. string[]: include only the keys in the array
	 * @return {_.Dictionary}         Filtered dictionary
	 */
	filterDictionaryKeys(dict, include) {
		if (_.isBoolean(include)) {
			return include === true ? dict : {}
		} else if (_.isArray(include)) {
			return _.pick, _.Dictionary > (dict, include)
		} else {
			return {}
		}
	}

	assignResult = (model, key, assignId = false) => {
		return function (x) {
			let m = model
			m[key] = x
			if (assignId) {
				if (_.isObject(x) && _.isNumber(x.id)) {
					m[key + "_id"] = x.id
				} else {
					m[key + "_id"] = null
				}
			}
			return x
		}
	}
}
