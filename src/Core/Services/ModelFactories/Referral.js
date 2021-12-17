/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 */
///
import { ModelFactory } from "./Model"

export class ReferralFactory extends ModelFactory {
	static $inject = ["ReferralService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "ReferralFactory", fn: ReferralFactory }
