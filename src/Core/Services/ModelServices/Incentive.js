/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:57:16
 */
///
import { Incentive } from "../../Classes"
import { ModelService } from "./Model"
import _ from "lodash"

export class IncentiveService extends ModelService {
	resource = "incentives"

	static $inject = ["$api", "$q", "FileService", "VideoService"]
	constructor($api, $q, FileService, VideoService) {
		super($api, $q)
		this.FileService = FileService
		this.VideoService = VideoService
		this.related.load.media = this.loadMedia
	}
	create = (_data) => {
		return Incentive.create(this, _data)
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

export const module = { key: "IncentiveService", fn: IncentiveService }
