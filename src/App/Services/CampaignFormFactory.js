import _ from "lodash"

import { V1ReferralThreadCampaignForm } from "./Forms/V1ReferralThreadCampaignForm"
import { V2ReferralThreadCampaignForm } from "./Forms/V2ReferralThreadCampaignForm"
import { V1MessageThreadCampaignForm } from "./Forms/V1MessageThreadCampaignForm"
import { V1ReachCampaignForm } from "./Forms/V1ReachCampaignForm"
import { V1RecognitionCampaignForm } from "./Forms/V1RecognitionCampaignForm"
import { V1ReviewCampaignForm } from "./Forms/V1ReviewCampaignForm"
import { V1TestimonialThreadCampaignForm } from "./Forms/V1TestimonialThreadCampaignForm"
import { V2TestimonialThreadCampaignForm } from "./Forms/V2TestimonialThreadCampaignForm"
import { V2LeaderboardCampaignForm } from "./Forms/V2LeaderboardCampaignForm"

class CampaignFormFactory {
	static $inject = ["CampaignFormService"]
	constructor(service) {
		this.service = service
	}
	create(data) {
		let forms = {
			"referral-thread": {
				1: V1ReferralThreadCampaignForm,
				2: V2ReferralThreadCampaignForm,
			},
			"message-thread": {
				1: V1MessageThreadCampaignForm,
			},
			reach: {
				1: V1ReachCampaignForm,
			},
			recognition: {
				1: V1RecognitionCampaignForm,
			},
			review: {
				1: V1ReviewCampaignForm,
			},
			"testimonial-thread": {
				1: V1TestimonialThreadCampaignForm,
				2: V2TestimonialThreadCampaignForm,
			},
			leaderboard: {
				2: V2LeaderboardCampaignForm,
			},
		}

		let form = _.get(forms, data.type + "." + data.version, null)

		if (form) {
			return new form(this.service, data)
		}
		throw (
			"Unknown type for CampaignForm: " +
			_.get(data, "type", "null") +
			" version " +
			_.get(data, "version", "null")
		)
	}
}

export const key = "CampaignFormFactory"
export const fn = CampaignFormFactory
