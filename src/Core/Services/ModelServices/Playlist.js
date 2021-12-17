/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:55:55
 */
///
import { ModelService } from "./Model"
import { Playlist } from "../../Classes"

export class PlaylistService extends ModelService {
	resource = "playlists"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return Playlist.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}
}

export const module = { key: "PlaylistService", fn: PlaylistService }
