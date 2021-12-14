/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-04 19:51:53
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Role extends Model {
	name

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.name
	}
}

export class RoleFactory extends ModelFactory {
	static $inject = ["RoleService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class RoleService extends ModelService {
	resource = "roles"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}
	create = (_data) => {
		return new Role(this, _data)
	}
}
