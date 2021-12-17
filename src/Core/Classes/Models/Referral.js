/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 */
///
import { Model } from "./Model"

export class Referral extends Model {
	company
	email
	first_name
	last_name
	phone
	link
	contact_id
	is_lead

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.first_name + " " + this.last_name
	}

	valueOf() {
		return super.valueOf()
	}
}
