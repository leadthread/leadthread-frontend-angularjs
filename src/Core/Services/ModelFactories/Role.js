/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-04 19:51:53
 */
///
import { ModelFactory } from "./Model"

export class RoleFactory extends ModelFactory {
	static $inject = ["RoleService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "RoleFactory", fn: RoleFactory }