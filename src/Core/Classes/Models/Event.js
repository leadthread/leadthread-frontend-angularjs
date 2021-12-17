/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-01 11:45:09
 */
///
import { Model } from "./Model"

export class Event extends Model {
	type
	link_id
	referral_id

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.created_at + " Event #" + this.id + " | " + this.type
	}
}
