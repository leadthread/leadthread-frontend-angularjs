///

import { Model } from "./Model"

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

	constructor(_service) {
		super(_service)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.name
	}
}
