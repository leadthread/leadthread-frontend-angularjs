/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:58:03
 */
///
import { Model } from "./Model"

export class Point extends Model {
	type
	contact_id
	sms_batch_id

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return "Point #" + this.id
	}

	valueOf() {
		return super.valueOf()
	}
}
