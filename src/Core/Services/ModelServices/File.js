/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:32
 */
///
import { ModelService } from "./Model"
import { File } from "../../Classes"

import _ from "lodash"

export class FileService extends ModelService {
	resource = "files"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return File.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}
}

export const module = { key: "FileService", fn: FileService }
