/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-14 14:31:52
 */
///
import { ActionPage } from "./ActionPage"
import { Model } from "./Model"

export class Thread extends Model {
	company_id
	name
	site
	site_id
	type
	brand
	brand_id

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		return {}
	}
}
