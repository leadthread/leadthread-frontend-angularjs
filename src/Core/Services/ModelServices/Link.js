/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 20:45:55
 */
///
import { Link } from "../../Classes"
import { ModelService } from "./Model"

export class LinkService extends ModelService {
	resource = "links"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return Link.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}
}

export const module = { key: "LinkService", fn: LinkService }
