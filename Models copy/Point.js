/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:58:03
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Point extends Model {
	type
	contact_id
	sms_batch_id

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return "Point #" + this.id
	}

	valueOf() {
		return super.valueOf()
	}
}

export class PointFactory extends ModelFactory {
	static $inject = ["PointService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class PointService extends ModelService {
	resource = "points"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new Point(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	index(params) {
		return super.index(params)
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}

	destroy(id) {
		return super.destroy(id)
	}
}
