import _ from "lodash"
import { TelephoneClass as Telephone } from "."

export class Person {
	company
	email
	first_name
	last_name
	phone
	sent

	constructor(...args) {
		this.sent = false
		if (args.length > 1) {
			this.first_name = args[0]
			this.last_name = args[1]
			this.email = args[2]
			this.phone = args[3]
			this.company = args[4]
		} else if (_.isObject(args[0])) {
			this.set(args[0])
		} else {
			throw "Could not create a Person instance"
		}

		this.transformProperties()
	}

	set(data) {
		_.forIn(data, (value, key) => {
			let self = this
			self[key] = value
		})
	}

	transformProperties() {
		if (!(this.phone instanceof Telephone)) {
			this.phone =
				_.isString(this.phone) && this.phone.length > 0
					? new Telephone(this.phone)
					: null
		}
	}

	valueOf() {
		return {
			first_name: this.first_name,
			last_name: this.last_name,
			email: this.email,
			company: this.company,
			phone:
				this.phone instanceof Telephone ? this.phone.valueOf() : null,
		}
	}

	toArray() {
		let x = this.valueOf(),
			z = []
		_.forIn(x, (value, key) => {
			z.push(value)
		})
		return z
	}

	setFullName(name) {
		if (_.isString(name)) {
			let n = name.split(" ")

			this.first_name = n[0]

			if (n.length > 1) {
				this.last_name = n[1]
			}
		} else {
			throw "Name must be a string!"
		}
	}

	getFullName() {
		let name = []
		if (_.isString(this.first_name)) {
			name.push(this.first_name)
		}
		if (_.isString(this.last_name)) {
			name.push(this.last_name)
		}
		return name.join(" ").trim()
	}
}
