/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:55:55
 */
///
import { ModelFactory } from "./Model"

export class PlaylistScheduleFactory extends ModelFactory {
	static $inject = ["PlaylistScheduleService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = {
	key: "PlaylistScheduleFactory",
	fn: PlaylistScheduleFactory,
}
