/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:32
 */
///
import { ModelFactory } from "./Model"
import _ from "lodash"

export class FileFactory extends ModelFactory {
	static $inject = ["FileService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "FileFactory", fn: FileFactory }
