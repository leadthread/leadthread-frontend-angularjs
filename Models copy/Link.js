/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 20:45:55
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Link extends Model {
	contact_id
	long_url
	sent_via
	short_url
	target_id
	target_type

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.long_url
	}
}

export class LinkFactory extends ModelFactory {
	static $inject = ["LinkService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class LinkService extends ModelService {
	resource = "links"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new Link(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}
}
