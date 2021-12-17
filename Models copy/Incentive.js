/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:16
 */
///
import { Model, ModelFactory, ModelService } from "./Model"
import _ from "lodash"

export class Incentive extends Model {
	text
	media
	media_id
	media_type

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return "Incentive #" + this.id
	}

	isEmpty() {
		return !_.isString(this.text) && !_.isObject(this.media)
	}
}

export class IncentiveFactory extends ModelFactory {
	static $inject = ["IncentiveService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class IncentiveService extends ModelService {
	resource = "incentives"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load.media = this.loadMedia
	}
	create = (_data) => {
		return new Incentive(this, _data)
	}
	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}
	loadMedia = (m) => {
		if (!m.media_id) {
			return this.$q.when(null)
		}
		let x
		if (m.media_type === "App\\Models\\File")
			x = this.FileService.show(m.media_id)
		else x = this.VideoService.show(m.media_id)
		return x
			.then((media) => {
				return media
			})
			.then(this.assignResult(m, "media", true))
	}
}
