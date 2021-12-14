///
import { Thread, ThreadFactory, ThreadService } from "./Thread"
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

	toString() {
		return this.name
	}

	getDefaults() {
		return _.merge(super.getDefaults(), {
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
		})
	}
}

export class ReferralThreadCampaign extends Campaign {}
export class LeaderboardCampaign extends Campaign {}
export class MessageThreadCampaign extends Campaign {}
export class TestimonialThreadCampaign extends Campaign {}
export class ReachCampaign extends Campaign {}
export class RecognitionCampaign extends Campaign {}
export class ReviewCampaign extends Campaign {}

export class CampaignFactory extends ThreadFactory {
	static $inject = ["CampaignService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class CampaignService extends ThreadService {
	resource = "campaigns"

	static $inject = ["$api", "$q", "SiteService", "BrandService"]
	constructor($api, $q, SiteService, BrandService) {
		super($api, $q, SiteService, BrandService)
		this.related.load.action_pages = this.loadActionPage
		this.related.load.incentive = this.loadIncentive
		this.related.save.before.action_pages = this.saveActionPage
		this.related.save.before.incentive = this.saveIncentive
	}

	create = (_data) => {
		switch (_data.type) {
			case "referral-thread":
				return new ReferralThreadCampaign(this, _data)
			case "leaderboard":
				return new LeaderboardCampaign(this, _data)
			case "message-thread":
				return new MessageThreadCampaign(this, _data)
			case "reach":
				return new ReachCampaign(this, _data)
			case "recognition":
				return new RecognitionCampaign(this, _data)
			case "review":
				return new ReviewCampaign(this, _data)
			case "testimonial-thread":
				return new TestimonialThreadCampaign(this, _data)
			default:
				throw (
					"Unknown type for Campaign: " + _.get(_data, "type", "null")
				)
		}
	}

	beforeSave(m) {
		m.company_id = m.company_id || this.$stateParams.companyId
		return m
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}

	loadActionPage = (m) => {
		return this.ActionPageService.showOrCreate(m.action_page_id, {
			name: m.type,
			type: m.type,
			company_id: m.company_id,
			brand: null,
			brand_id: null,
		}).then(this.assignResult(m, "action_page"))
	}

	saveActionPage = (m, include) => {
		return this.ActionPageService.save(m.action_page, include).then(
			this.assignResult(m, "action_page", true)
		)
	}

	saveIncentive = (m, include) => {
		if (m.incentive) {
			return this.IncentiveService.save(m.incentive, include).then(
				this.assignResult(m, "incentive", true)
			)
		} else {
			return this.$q.when(null)
		}
	}

	loadIncentive = (m) => {
		if (
			m.type === "referral-thread" ||
			m.type === "leaderboard" ||
			m.type === "testimonial-thread"
		) {
			return this.IncentiveService.showOrCreate(m.incentive_id, {
				text: null,
			}).then(this.assignResult(m, "incentive"))
		} else {
			return this.$q.when(null)
		}
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}
}
