/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-04 19:51:53
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class SmsBatch extends Model {
	count
	created_at
	campaign_id
	campaign

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return "Batch #" + this.id
	}
}

export class SmsBatchFactory extends ModelFactory {
	static $inject = ["SmsBatchService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class SmsBatchService extends ModelService {
	resource = "batches"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load.campaign = this.loadCampaign
	}

	create = (_data) => {
		return new SmsBatch(this, _data)
	}

	loadCampaign = (m) => {
		return this.CampaignService.show(m.campaign_id).then(
			this.assignResult(m, "campaign")
		)
	}
}
