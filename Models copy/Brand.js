///

import { Model, ModelFactory, ModelService } from "./Model"

export class Brand extends Model {
	name
	logo_id
	logo
	favicon_id
	favicon
	domain
	color
	company_id
	logo_background_color
	homepage_url

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.name
	}
}

export class BrandFactory extends ModelFactory {
	static $inject = ["BrandService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class BrandService extends ModelService {
	resource = "brands"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load.logo = this.loadLogo
		this.related.load.favicon = this.loadFavicon
	}

	create = (_data) => {
		return new Brand(this, _data)
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
