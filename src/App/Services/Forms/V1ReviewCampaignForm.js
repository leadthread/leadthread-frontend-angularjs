import { V1MessageThreadCampaignForm } from "./V1MessageThreadCampaignForm"

export class V1ReviewCampaignForm extends V1MessageThreadCampaignForm {
	constructor(service, data) {
		super(service, data)
		this.type = "review"
		this.version = 1
	}
}

export const module = {
	key: "V1ReviewCampaignForm",
	fn: V1ReviewCampaignForm,
}
