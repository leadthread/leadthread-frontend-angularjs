/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:55:55
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class PlaylistSchedule extends Model {
	name
	playlist_id

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.name
	}
}

export class PlaylistScheduleFactory extends ModelFactory {
	static $inject = ["PlaylistScheduleService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class PlaylistScheduleService extends ModelService {
	resource = "schedules"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new PlaylistSchedule(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}
}
