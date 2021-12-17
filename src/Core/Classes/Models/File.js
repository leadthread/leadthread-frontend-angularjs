/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:32
 */
///
import { Model } from "./Model"
import _ from "lodash"

export class File extends Model {
	fingerprint
	mime

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.getUrl()
	}

	getUrl() {
		if (_.isString(this.fingerprint) && this.fingerprint.length > 0) {
			return "/files/" + this.fingerprint + "/thumb/480"
		}
		return null
	}
}

export class Image extends File {}
export class Document extends File {}
