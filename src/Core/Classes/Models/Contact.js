/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:58:03
 */
///
import { Model, ModelFactory, ModelService } from "./Model"
import _ from "lodash"

export class Contact extends Model {
	company
	email
	first_name
	last_name
	phone
	link
	points

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.first_name + " " + this.last_name
	}

	valueOf() {
		return super.valueOf()
	}

	getAttributes() {
		let properties = super.getAttributes()
		_.pull(properties, "sent")
		_.pull(properties, "selected")
		return properties
	}
}

export class ContactFactory extends ModelFactory {
	static $inject = ["ContactService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class ContactService extends ModelService {
	resource = "contacts"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new Contact(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	index(params) {
		return super.index(params)
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}

	destroy(id) {
		return super.destroy(id)
	}
}
