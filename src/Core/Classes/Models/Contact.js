/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:58:03
 */
///
import { Model } from "./Model"
import _ from "lodash"

export class Contact extends Model {
	company
	email
	first_name
	last_name
	phone
	link
	points

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

	getAttributes() {
		let properties = super.getAttributes()
		_.pull(properties, "sent")
		_.pull(properties, "selected")
		return properties
	}
}
