/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 20:45:55
 */
///
import { Model } from "./Model"

export class Link extends Model {
	contact_id
	long_url
	sent_via
	short_url
	target_id
	target_type

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.long_url
	}
}
