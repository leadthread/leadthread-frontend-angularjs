///
import { ThreadFactory } from "./Thread"

export class CampaignFactory extends ThreadFactory {
	static $inject = ["CampaignService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "CampaignFactory", fn: CampaignFactory }
