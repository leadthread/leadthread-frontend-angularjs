/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:54:50
 */
///
///
import _ from "lodash"
import { Model, ModelFactory, ModelService } from "./Model"
import {
	ActionPagePage,
	IncentivePreviewPage,
	IntroPage,
	MemoryPromptPage,
	SharePage,
	SmsPreviewPage,
	SocialPreviewPage,
	ThankYouPage,
} from "./Page"

export class Site extends Model {
	pages
	name
	type
	company_id

	constructor(_service, _data) {
		super(_service, _data)
		this.pages = this.pages || []
	}

	toString() {
		return this.name
	}

	createPage(type, options = {}) {
		return this._service.createPage(this, type, options)
	}

	setPage(page, find) {
		// Find item index using indexOf+find
		var index = _.indexOf(this.pages, _.find(this.pages, find))

		if (index !== -1) {
			// Replace item at index using native splice
			this.pages.splice(index, 1, page)
		} else {
			this.pages.push(page)
		}
	}

	deletePage(find) {
		var page = _.find(this.pages, find)
		if (page) {
			return page.destroy().then(() => {
				_.remove(this.pages, find)
			})
		}
	}

	getPage(find) {
		let page = _.find(this.pages, find)
		return page
	}

	getPages(find) {
		return _.filter(this.pages, find)
	}

	getActionPagePage() {
		var p = this.getPage((m) => {
			return m.type === "action"
		})

		return p ? p : this.createPage("action")
	}

	setActionPagePage(m) {
		if (m instanceof ActionPagePage) {
			return this.setPage(m, function (p) {
				return p instanceof ActionPagePage
			})
		}
	}

	getIntroPage() {
		var p = this.getPage((m) => {
			return m.type === "intro"
		})

		return p ? p : this.createPage("intro")
	}

	setIntroPage(m) {
		if (m instanceof IntroPage) {
			return this.setPage(m, function (p) {
				return p instanceof IntroPage
			})
		}
	}

	getSharePage() {
		var p = this.getPage((m) => {
			return m.type === "share"
		})

		return p ? p : this.createPage("share")
	}

	setSharePage(m) {
		if (m instanceof SharePage) {
			return this.setPage(m, function (p) {
				return p instanceof SharePage
			})
		}
	}

	getMemoryPromptPage(name = null) {
		var p = this.getPage((m) => {
			return m.type === "prompt" && (name ? m.name === name : true)
		})

		let opts = {}
		if (name) {
			opts.name = name
		}

		return p ? p : this.createPage("prompt", opts)
	}

	setMemoryPromptPage(key, page) {
		if (page instanceof MemoryPromptPage) {
			return this.setPage(page, (p) => {
				return p instanceof MemoryPromptPage && p.name === key
			})
		}
	}

	getMemoryPromptPages() {
		var p = this.getPages((m) => {
			return m.type === "prompt"
		})

		return p ? p : []
	}

	getThankYouPage() {
		var p = this.getPage((m) => {
			return m.type === "thank"
		})

		return p ? p : this.createPage("thank")
	}

	setThankYouPage(page) {
		if (page instanceof ThankYouPage) {
			return this.setPage(page, function (p) {
				return p instanceof ThankYouPage
			})
		}
	}
}

export class PreviewSite extends Site {
	// PreviewSite specific functions go here
	getSmsPreviewPage() {
		var p = this.getPage((m) => {
			return m.type === "smspreview"
		})

		return p ? p : this.createPage("smspreview")
	}

	setSmsPreviewPage(m) {
		if (m instanceof SmsPreviewPage) {
			return this.setPage(m, function (p) {
				return p instanceof SmsPreviewPage
			})
		}
	}

	getSocialPreviewPage() {
		var p = this.getPage((m) => {
			return m.type === "socialpreview"
		})

		return p ? p : this.createPage("socialpreview")
	}

	setSocialPreviewPage(m) {
		if (m instanceof SocialPreviewPage) {
			return this.setPage(m, function (p) {
				return p instanceof SocialPreviewPage
			})
		}
	}

	getIncentivePreviewPage() {
		var p = this.getPage((m) => {
			return m.type === "incentivepreview"
		})

		return p ? p : this.createPage("incentivepreview")
	}

	setIncentivePreviewPage(m) {
		if (m instanceof IncentivePreviewPage) {
			return this.setPage(m, function (p) {
				return p instanceof IncentivePreviewPage
			})
		}
	}
}

export class ReferralThreadSite extends Site {}
export class LeaderboardSite extends Site {}
export class ActionPageSite extends Site {}
export class MessageThreadSite extends Site {}
export class ReachSite extends Site {}
export class RecognitionSite extends Site {}
export class ReviewSite extends Site {}
export class TestimonialThreadSite extends Site {}

export class SiteFactory extends ModelFactory {
	static $inject = ["SiteService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class SiteService extends ModelService {
	resource = "sites"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load = {
			pages: this.loadPages,
		}
		this.related.save.after.pages = this.savePages
	}

	create = (_data) => {
		switch (_data.type) {
			case "preview":
				return new PreviewSite(this, _data)
			case "referral-thread":
				return new ReferralThreadSite(this, _data)
			case "leaderboard":
				return new LeaderboardSite(this, _data)
			case "testimonial-thread":
				return new TestimonialThreadSite(this, _data)
			case "message-thread":
				return new MessageThreadSite(this, _data)
			case "reach":
				return new ReachSite(this, _data)
			case "recognition":
				return new RecognitionSite(this, _data)
			case "review":
				return new ReviewSite(this, _data)
			case "action":
				return new ActionPageSite(this, _data)
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
