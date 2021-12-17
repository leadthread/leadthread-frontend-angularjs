/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-14 14:31:52
 */
///
import { ActionPage } from "./ActionPage"
import { ModelFactory } from "./Model"

export class ThreadFactory extends ModelFactory {
	static $inject = ["ThreadService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "ThreadFactory", fn: ThreadFactory }
