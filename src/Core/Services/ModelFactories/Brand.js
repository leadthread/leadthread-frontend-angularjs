///

import { ModelFactory } from "./Model"
export class BrandFactory extends ModelFactory {
	static $inject = ["BrandService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "BrandFactory", fn: BrandFactory }
