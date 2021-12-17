/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-14 14:31:52
 */
///
import { ActionPage } from "./ActionPage"
import { Model, ModelFactory, ModelService } from "./Model"

export class Thread extends Model {
	company_id
	name
	site
	site_id
	type
	brand
	brand_id

	constructor(_service, _data) {
		super(_service, _data)
	}
}

export class ThreadFactory extends ModelFactory {
	static $inject = ["ThreadService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class ThreadService extends ModelService {
	resource = null

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load.brand = this.loadBrand
		this.related.load.site = this.loadSite
		this.related.save.before.brand = this.saveBrand
		this.related.save.before.site = this.saveSite
	}

	loadBrand = (m) => {
		return this.BrandService.showOrCreate(m.brand_id, {
			name: null,
			logo_id: null,
			logo: null,
			favicon_id: null,
			favicon: null,
			domain: null,
			color: "#666666",
			company_id: m.company_id,
			logo_background_color: "#FFFFFF",
			homepage_url: null,
		})
			.then(this.assignResult(m, "brand"))
			.catch(() => {
				return null
			})
	}

	loadSite = (m) => {
		let type
		if (m instanceof ActionPage) {
			type = "action"
		} else {
			type = m.type
		}

		return this.SiteService.showOrCreate(m.site_id, {
			type: type,
			name: type,
			company_id: m.company_id,
			pages: [],
		}).then(this.assignResult(m, "site"))
	}

	saveSite = (m, include) => {
		return m.site.save(include).then(this.assignResult(m, "site", true))
	}

	saveBrand = (m, include) => {
		return m.brand.save(include).then(this.assignResult(m, "brand", true))
	}
}
