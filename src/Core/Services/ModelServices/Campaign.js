///
import _ from "lodash"
import {
	ReferralThreadCampaign,
	LeaderboardCampaign,
	MessageThreadCampaign,
	ReachCampaign,
	RecognitionCampaign,
	ReviewCampaign,
	TestimonialThreadCampaign,
} from "../../Classes/Models/Campaign"
import { ThreadService } from "./Thread"

export class CampaignService extends ThreadService {
	resource = "campaigns"

	static $inject = [
		"$api",
		"$q",
		"BrandService",
		"SiteService",
		"ActionPageService",
		"IncentiveService",
	]
	constructor(
		$api,
		$q,
		BrandService,
		SiteService,
		ActionPageService,
		IncentiveService
	) {
		super($api, $q, BrandService, SiteService)
		this.ActionPageService = ActionPageService
		this.IncentiveService = IncentiveService
		this.related.load.action_pages = this.loadActionPage
		this.related.load.incentive = this.loadIncentive
		this.related.save.before.action_pages = this.saveActionPage
		this.related.save.before.incentive = this.saveIncentive
	}

	create = (_data) => {
		switch (_data.type) {
			case "referral-thread":
				return ReferralThreadCampaign.create(this, _data)
			case "leaderboard":
				return LeaderboardCampaign.create(this, _data)
			case "message-thread":
				return MessageThreadCampaign.create(this, _data)
			case "reach":
				return ReachCampaign.create(this, _data)
			case "recognition":
				return RecognitionCampaign.create(this, _data)
			case "review":
				return ReviewCampaign.create(this, _data)
			case "testimonial-thread":
				return TestimonialThreadCampaign.create(this, _data)
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
		console.log("loadActionPage", m)

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

export const module = { key: "CampaignService", fn: CampaignService }
