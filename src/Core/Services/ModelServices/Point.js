/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:58:03
 */
///
import { ModelService } from "./Model"
import { Point } from "../../Classes"

export class PointService extends ModelService {
	resource = "points"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return Point.create(this, _data)
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

export const module = { key: "PointService", fn: PointService }
