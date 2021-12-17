///
import { Brand } from "../../Classes"
import { ModelService } from "./Model"

export class BrandService extends ModelService {
	resource = "brands"

	static $inject = ["$api", "$q", "FileService"]
	constructor($api, $q, FileService) {
		super($api, $q, FileService)
		this.FileService = FileService
		this.related.load.logo = this.loadLogo
		this.related.load.favicon = this.loadFavicon
	}

	create = (_data) => {
		return Brand.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}

	loadLogo = (m) => {
		return this.FileService.show(m.logo_id)
			.then(this.assignResult(m, "logo"))
			.catch(() => {
				return null
			})
	}

	loadFavicon = (m) => {
		return this.FileService.show(m.favicon_id)
			.then(this.assignResult(m, "favicon"))
			.catch(() => {
				return null
			})
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}
}

export const module = { key: "BrandService", fn: BrandService }
