/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-01 11:45:09
 */
///
import { ModelFactory } from "./Model"

export class EventFactory extends ModelFactory {
	static $inject = ["EventService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "EventFactory", fn: EventFactory }
