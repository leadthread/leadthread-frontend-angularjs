/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:32
 */
///
import { Model, ModelFactory, ModelService } from "./Model"
import _ from "lodash"

export class File extends Model {
	fingerprint
	mime

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.getUrl()
	}

	getUrl() {
		if (_.isString(this.fingerprint) && this.fingerprint.length > 0) {
			return "/files/" + this.fingerprint + "/thumb/480"
		}
		return null
	}
}

export class Image extends File {}
export class Document extends File {}

export class FileFactory extends ModelFactory {
	static $inject = ["FileService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class FileService extends ModelService {
	resource = "files"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new File(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}
}
