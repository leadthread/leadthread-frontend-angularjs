/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:52:52
 */
///
import { ModelService } from "./Model"
import { Story } from "../../Classes"

export class StoryService extends ModelService {
	resource = "stories"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}
	create = (_data) => {
		return Story.create(this, _data)
	}
}

export const module = { key: "StoryService", fn: StoryService }
