/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:52:52
 */
///
import { Model } from "./Model"

export class Story extends Model {
	type
	video
	image
	caption

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		return {}
	}

	toString() {
		return "Story #" + this.id + " " + this.type
	}
}
