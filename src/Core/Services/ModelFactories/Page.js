/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:56:00
 */
///
import _ from "lodash"
import { ModelFactory } from "./Model"

export class PageFactory extends ModelFactory {
	static $inject = ["PageService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "PageFactory", fn: PageFactory }
