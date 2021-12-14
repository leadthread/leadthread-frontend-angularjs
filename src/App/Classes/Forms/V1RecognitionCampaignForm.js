import { V1MessageThreadCampaignForm } from "./V1MessageThreadCampaignForm"

export class V1RecognitionCampaignForm extends V1MessageThreadCampaignForm {
	constructor(service, data) {
		super(service, data)
		this.type = "recognition"
		this.version = 1
	}
}
