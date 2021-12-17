/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:54:50
 */
///
///
import _ from "lodash"
import { ModelService } from "./Model"
import {
	PreviewSite,
	ReferralThreadSite,
	LeaderboardSite,
	TestimonialThreadSite,
	MessageThreadSite,
	ReachSite,
	RecognitionSite,
	ReviewSite,
	ActionPageSite,
} from "../../Classes/Models/Site"

export class SiteService extends ModelService {
	resource = "sites"

	static $inject = ["$api", "$q", "PageService"]
	constructor($api, $q, PageService) {
		super($api, $q)
		this.PageService = PageService
		this.related.load = {
			pages: this.loadPages,
		}
		this.related.save.after.pages = this.savePages
	}

	create = (_data) => {
		switch (_data.type) {
			case "preview":
				return PreviewSite.create(this, _data)
			case "referral-thread":
				return ReferralThreadSite.create(this, _data)
			case "leaderboard":
				return LeaderboardSite.create(this, _data)
			case "testimonial-thread":
				return TestimonialThreadSite.create(this, _data)
			case "message-thread":
				return MessageThreadSite.create(this, _data)
			case "reach":
				return ReachSite.create(this, _data)
			case "recognition":
				return RecognitionSite.create(this, _data)
			case "review":
				return ReviewSite.create(this, _data)
			case "action":
				return ActionPageSite.create(this, _data)
			default:
				throw "Unknown type for Site: " + _.get(_data, "type", "null")
		}
	}

	beforeSave(m) {
		m.company_id = m.company_id || this.$stateParams.companyId
		return m
	}

	loadPages = (m) => {
		if (m.id) {
			return this.PageService.indexFor(this.resource, m.id).then(
				this.assignResult(m, "pages")
			)
		} else {
			return this.$q.when([])
		}
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}

	show(id) {
		return super.show(id)
	}

	index() {
		return super.index()
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}

	destroy(id) {
		return super.destroy(id)
	}

	createPage(m, type, options = {}) {
		let page = {
			type: type,
			order: 0,
			sections: [],
			background_color: "#FFFFFF",
			company_id: m.company_id,
			name: null,
			site_id: m.id,
		}

		return this.PageService.create(_.merge(page, options))
	}

	savePages = (m, include) => {
		let p = []
		_.forEach(m.pages, (page) => {
			p.push(this.PageService.saveFor(this.resource, m.id, page, include))
		})
		return this.$q.all(p)
	}
}

export const module = { key: "SiteService", fn: SiteService }
