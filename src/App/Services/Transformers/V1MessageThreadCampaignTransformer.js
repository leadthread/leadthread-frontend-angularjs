import { CampaignTransformer } from "./CampaignTransformer"
import _ from "lodash"

export class V1MessageThreadCampaignTransformer extends CampaignTransformer {
	toCampaign(form) {
		return this.createCampaignInstance(form).then((campaign) => {
			campaign.is_phone_app = false
			campaign.contact_text_message = form.getField("uPMessage").value // SMS To Contact [string]
			campaign.name = form.getField("campaignName").value
			campaign.keyword = form.getField("campaignKeyword").value
			campaign.channel = null
			campaign.content_sharing = false // Should Site Allow Testimonials [boolean]

			var promise = []
			promise.push(this.$q.when(this.setBrand(campaign, form)))
			promise.push(this.$q.when(this.setActionPage(campaign, form)))

			return this.$q.all(promise).then(() => {
				this.campaign = campaign
				return campaign
			})
		})
	}

	toForm(campaign) {
		var form = this.createFormInstance(campaign)

		this.setNameFormField(form, campaign)
		this.setKeywordFormField(form, campaign)
		this.setBrandingFormFields(form, campaign)
		this.setUserContactMessageFormField(form, campaign)

		this.setActionPageFormFields(form, campaign)

		return form
	}
}

export const module = {
	key: "V1MessageThreadCampaignTransformer",
	fn: V1MessageThreadCampaignTransformer,
}
