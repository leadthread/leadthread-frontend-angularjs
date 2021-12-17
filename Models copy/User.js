/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:51:06
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class User extends Model {
	first_name
	last_name
	email
	phone
	company

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.first_name + " " + this.last_name
	}
}

export class UserFactory extends ModelFactory {
	static $inject = ["UserService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class UserService extends ModelService {
	resource = "users"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new User(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}
}
