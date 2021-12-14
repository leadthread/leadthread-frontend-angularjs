import _ from "lodash"

export class CampaignTransformerFactory {
	static $inject = [
		"V1MessageThreadCampaignTransformer",
		"V1ReferralThreadCampaignTransformer",
		"V1TestimonialThreadCampaignTransformer",
		"V2ReferralThreadCampaignTransformer",
		"V2TestimonialThreadCampaignTransformer",
		"V2LeaderboardCampaignTransformer",
		"V1ReachCampaignTransformer",
		"V1RecognitionCampaignTransformer",
		"V1ReviewCampaignTransformer",
	]

	constructor(
		V1MessageThreadCampaignTransformer,
		V1ReferralThreadCampaignTransformer,
		V1TestimonialThreadCampaignTransformer,
		V2ReferralThreadCampaignTransformer,
		V2TestimonialThreadCampaignTransformer,
		V2LeaderboardCampaignTransformer,
		V1ReachCampaignTransformer,
		V1RecognitionCampaignTransformer,
		V1ReviewCampaignTransformer
	) {}

	create(data) {
		let transformers = {
			"message-thread": {
				1: this.V1MessageThreadCampaignTransformer,
			},
			reach: {
				1: this.V1ReachCampaignTransformer,
			},
			recognition: {
				1: this.V1RecognitionCampaignTransformer,
			},
			review: {
				1: this.V1ReviewCampaignTransformer,
			},
			"referral-thread": {
				1: this.V1ReferralThreadCampaignTransformer,
				2: this.V2ReferralThreadCampaignTransformer,
			},
			leaderboard: {
				2: this.V2LeaderboardCampaignTransformer,
			},
			"testimonial-thread": {
				1: this.V1TestimonialThreadCampaignTransformer,
				2: this.V2TestimonialThreadCampaignTransformer,
			},
		}

		let transformer = _.get(
			transformers,
			data.type + "." + data.version,
			null
		)

		if (transformer) {
			return transformer
		}

		throw (
			"Unknown type for CampaignTransformer: " +
			_.get(data, "type", "null") +
			" version " +
			_.get(data, "version", "null")
		)
	}
}
