/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:52:52
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Story extends Model {
	type
	video
	image
	caption

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return "Story #" + this.id + " " + this.type
	}
}

export class StoryFactory extends ModelFactory {
	static $inject = ["StoryService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class StoryService extends ModelService {
	resource = "stories"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}
	create = (_data) => {
		return new Story(this, _data)
	}
}
