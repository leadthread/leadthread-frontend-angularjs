/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-04 19:51:53
 */
///
import { ModelService } from "./Model"
import { SmsBatch } from "../../Classes"

export class SmsBatchService extends ModelService {
	resource = "batches"

	static $inject = ["$api", "$q", "CampaignService"]
	constructor($api, $q, CampaignService) {
		super($api, $q)
		this.CampaignService = CampaignService
		this.related.load.campaign = this.loadCampaign
	}

	create = (_data) => {
		return SmsBatch.create(this, _data)
	}

	loadCampaign = (m) => {
		return this.CampaignService.show(m.campaign_id).then(
			this.assignResult(m, "campaign")
		)
	}
}

export const module = { key: "SmsBatchService", fn: SmsBatchService }
