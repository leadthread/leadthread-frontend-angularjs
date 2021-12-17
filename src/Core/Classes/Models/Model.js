///
import _ from "lodash"

export class Model {
	id
	created_at
	updated_at

	constructor(_service, _data) {
		this._service = _service
		// this.set(_data)
	}

	static create(_service, _data) {
		return Object.assign(new this(_service), {
			...this.getDefaults(),
			..._data,
		})
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
		console.log("valueOf", typeof this, x)
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
}
