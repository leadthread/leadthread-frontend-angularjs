/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:52:14
 */
///
import { Model } from "./Model"

export class Video extends Model {
	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		return {}
	}

	toString() {
		return "Video #" + this.id
	}
}
