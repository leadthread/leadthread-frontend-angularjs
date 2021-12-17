/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-04 19:51:53
 */
///
import { Model } from "./Model"

export class SmsBatch extends Model {
	count
	created_at
	campaign_id
	campaign

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		return {}
	}

	toString() {
		return "Batch #" + this.id
	}
}
