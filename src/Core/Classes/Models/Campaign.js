///
import { Thread } from "./Thread"
import _ from "lodash"

export class Campaign extends Thread {
	action_page
	action_page_id
	channel
	company_id
	contact_text_message
	content_sharing
	incentive
	incentive_id
	is_phone_app
	loaded
	name
	keyword
	owner_id
	referral_text_message
	social_message
	target
	type
	version

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {
			company_id: null,
			content_sharing: true,
			incentive: null,
			incentive_id: null,
			is_phone_app: false,
			name: null,
			keyword: null,
			owner_id: null,
			target: null,
			type: null,
			brand: null,
			brand_id: null,
			version: null,
		}
		return defaults
	}

	toString() {
		return this.name
	}
}

export class ReferralThreadCampaign extends Campaign {}
export class LeaderboardCampaign extends Campaign {}
export class MessageThreadCampaign extends Campaign {}
export class TestimonialThreadCampaign extends Campaign {}
export class ReachCampaign extends Campaign {}
export class RecognitionCampaign extends Campaign {}
export class ReviewCampaign extends Campaign {}
