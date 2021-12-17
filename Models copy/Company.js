/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:58:13
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Company extends Model {
	name
	brand
	brand_id
	disabled_at

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.name
	}
}

export class CompanyFactory extends ModelFactory {
	static $inject = ["CompanyService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class CompanyService extends ModelService {
	resource = "companies"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load.brand = this.loadBrand
	}

	create = (_data) => {
		return new Company(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}

	paginate(page = 1, limit = 24, params) {
		return super.paginate(page, limit, params)
	}

	index(params) {
		return super.index(params)
	}

	indexFor(parentResource, parentId, params) {
		return super.indexFor(parentResource, parentId, params)
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
}
