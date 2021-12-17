/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-04 19:51:53
 */
///
import { ModelService } from "./Model"
import { Role } from "../../Classes"

export class RoleService extends ModelService {
	resource = "roles"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}
	create = (_data) => {
		return Role.create(this, _data)
	}
}

export const module = { key: "RoleService", fn: RoleService }
