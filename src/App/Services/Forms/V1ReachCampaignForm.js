import { V1MessageThreadCampaignForm } from "./V1MessageThreadCampaignForm"

export class V1ReachCampaignForm extends V1MessageThreadCampaignForm {
	constructor(service, data) {
		super(service, data)
		this.type = "reach"
		this.version = 1
	}
}

export const module = {
	key: "V1ReachCampaignForm",
	fn: V1ReachCampaignForm,
}
