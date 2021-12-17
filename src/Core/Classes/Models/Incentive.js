/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:16
 */
///
import { Model } from "./Model"
import _ from "lodash"

export class Incentive extends Model {
	text
	media
	media_id
	media_type

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return "Incentive #" + this.id
	}

	isEmpty() {
		return !_.isString(this.text) && !_.isObject(this.media)
	}
}
