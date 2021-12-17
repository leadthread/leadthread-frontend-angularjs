/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:52:14
 */
///
import { ModelService } from "./Model"
import { Video } from "../../Classes"

export class VideoService extends ModelService {
	resource = "videos"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return Video.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}
}

export const module = { key: "VideoService", fn: VideoService }
