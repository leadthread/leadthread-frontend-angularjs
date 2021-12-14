/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:52:14
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Video extends Model {
	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return "Video #" + this.id
	}
}

export class VideoFactory extends ModelFactory {
	static $inject = ["VideoService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class VideoService extends ModelService {
	resource = "videos"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new Video(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}
}
