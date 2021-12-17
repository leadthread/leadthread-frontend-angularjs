/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:54:50
 */
///
///
import _ from "lodash"
import { Model } from "./Model"
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
	constructor(_service, _data) {
		super(_service, _data)
		this.pages = this.pages || []
	}

	static getDefaults() {
		return {}
	}

	get pageAction() {
		return this.getActionPagePage()
	}

	get pageIntro() {
		return this.getIntroPage()
	}

	get pageShare() {
		return this.getSharePage()
	}

	get pageThankYou() {
		return this.getThankYouPage()
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
	static getDefaults() {
		return {}
	}

	get pageSmsPreview() {
		return this.getSmsPreviewPage()
	}
	get pageSocialPreview() {
		return this.getSocialPreviewPage()
	}
	get pageIncentivePreview() {
		return this.getIncentivePreviewPage()
	}

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
