/* eslint-disable indent */
/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:56:00
 */
///
import _ from "lodash"
import { Model } from "./Model"
import {
	ButtonSection,
	IncentivePreviewSection,
	MediaSection,
	SmsPreviewSection,
	SocialPreviewSection,
} from "./Section"

export class Page extends Model {
	constructor(_service, _data) {
		super(_service, _data)
		this.sections = this.sections || []
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.name
	}

	createSection(_data) {
		return this._service.createSection(_data)
	}

	addSection(find, params) {
		let section = this.getSection(find)
		section = section ? section : this.createSection(find)

		for (let key in params) {
			section[key] = params[key]
		}
		for (let key in find) {
			section[key] = find[key]
		}

		this.setSection(section, find)
	}

	setSection(section, find) {
		// Find item index using indexOf+find
		var index = _.indexOf(this.sections, _.find(this.sections, find))

		if (index !== -1) {
			// Replace item at index using native splice
			this.sections.splice(index, 1, section)
			// this.sections[index] = section;
		} else {
			this.sections.push(section)
		}

		this.sections = [...this.sections]

		return section
	}

	getSection(find) {
		return _.find(this.sections, find)
	}

	getSections(find) {
		return _.filter(this.sections, find)
	}

	getButtonSection(find) {
		let p
		if (find) {
			p = this.getSection(find)
		}
		return p
			? p
			: this.createSection({ type: "tel", company_id: this.company_id })
	}

	getButtonSections(name = null) {
		return this.getSections((s) => {
			return (
				s instanceof ButtonSection &&
				(name ? _.includes(s.name, name) : true)
			)
		})
	}

	setButtonSection(find, section) {
		if (section instanceof ButtonSection) {
			return this.setSection(section, find)
		}
	}

	deleteSection(find) {
		return this.deleteSections(find)
	}

	deleteSections(find) {
		return this._service.deleteSections(this, find)
	}
}

export class IntroPage extends Page {
	static getDefaults() {
		const defaults = {}
		return defaults
	}

	getMediaSection() {
		var p = this.getSection((p) => {
			return p instanceof MediaSection
		})

		return p
			? p
			: this.createSection({ type: "image", company_id: this.company_id })
	}

	setMediaSection(section) {
		if (section instanceof MediaSection) {
			return this.setSection(section, (p) => {
				return p instanceof MediaSection
			})
		}
	}

	getHeaderSection() {
		var p = this.getSection(function (p) {
			return p.type === "text" && p.name === "intro_header"
		})

		return p
			? p
			: this.createSection({ type: "text", company_id: this.company_id })
	}

	setHeaderSection(section) {
		if (section.type === "text") {
			return this.setSection(section, function (p) {
				return p.type === "text" && p.name === "intro_header"
			})
		}
	}

	getBodySection() {
		let p = this.getSection((p) => {
			return p.type === "text" && p.name === "intro_body"
		})

		return p
			? p
			: this.createSection({
					type: "text",
					name: "intro_body",
					company_id: this.company_id,
			  })
	}

	setBodySection(section) {
		if (section.type === "text") {
			return this.setSection(section, (p) => {
				return p.type === "text" && p.name === "intro_body"
			})
		}
	}

	getFooterSection() {
		let p = this.getSection((p) => {
			return p.type === "text" && p.name === "intro_footer"
		})

		return p
			? p
			: this.createSection({
					type: "text",
					name: "intro_footer",
					company_id: this.company_id,
			  })
	}

	setFooterSection(section) {
		if (section.type === "text") {
			return this.setSection(section, (p) => {
				return p.type === "text" && p.name === "intro_footer"
			})
		}
	}

	getTestimonialSection() {
		let p = this.getSection((p) => {
			return p.type === "testimonial" && p.name === "intro_testimonial"
		})

		return p
			? p
			: this.createSection({
					type: "testimonial",
					name: "intro_testimonial",
					company_id: this.company_id,
			  })
	}

	setTestimonialSection(section) {
		if (section.type === "testimonial") {
			return this.setSection(section, function (p) {
				return (
					p.type === "testimonial" && p.name === "intro_testimonial"
				)
			})
		}
	}
}

export class ThankYouPage extends Page {
	static getDefaults() {
		const defaults = {}
		return defaults
	}

	getHeaderSection() {
		var p = this.getSection(function (p) {
			return p.type === "text" && p.name === "thanks_header"
		})

		return p
			? p
			: this.createSection({ type: "text", company_id: this.company_id })
	}

	setHeaderSection(section) {
		if (section.type === "text") {
			return this.setSection(section, function (p) {
				return p.type === "text" && p.name === "thanks_header"
			})
		}
	}

	getBodySection() {
		let p = this.getSection((p) => {
			return p.type === "text" && p.name === "thanks_body"
		})

		return p
			? p
			: this.createSection({
					type: "text",
					name: "thanks_body",
					company_id: this.company_id,
			  })
	}

	setBodySection(section) {
		if (section.type === "text") {
			return this.setSection(section, (p) => {
				return p.type === "text" && p.name === "thanks_body"
			})
		}
	}
}

export class PreviewPage extends Page {
	static getDefaults() {
		const defaults = {}
		return defaults
	}

	getSocialPreviewSection() {
		let p = this.getSection((p) => {
			return (
				p instanceof SocialPreviewSection && p.name === "socialpreview"
			)
		})

		return p
			? p
			: this.createSection({
					type: "socialpreview",
					name: "socialpreview",
					company_id: this.company_id,
			  })
	}

	setSocialPreviewSection(section) {
		if (section instanceof SocialPreviewSection) {
			return this.setSection(section, (p) => {
				return (
					p instanceof SocialPreviewSection &&
					p.name === "socialpreview"
				)
			})
		}
	}

	getSmsPreviewSection() {
		let p = this.getSection((p) => {
			return p instanceof SmsPreviewSection && p.name === "smspreview"
		})

		return p
			? p
			: this.createSection({
					type: "smspreview",
					name: "smspreview",
					company_id: this.company_id,
			  })
	}

	setSmsPreviewSection(section) {
		if (section instanceof SmsPreviewSection) {
			return this.setSection(section, (p) => {
				return p instanceof SmsPreviewSection && p.name === "smspreview"
			})
		}
	}

	getIncentivePreviewSection() {
		let p = this.getSection((p) => {
			return (
				p instanceof IncentivePreviewSection &&
				p.name === "incentivepreview"
			)
		})

		return p
			? p
			: this.createSection({
					type: "incentivepreview",
					name: "incentivepreview",
					company_id: this.company_id,
			  })
	}

	setIncentivePreviewSection(section) {
		if (section instanceof IncentivePreviewSection) {
			return this.setSection(section, (p) => {
				return (
					p instanceof IncentivePreviewSection &&
					p.name === "incentivepreview"
				)
			})
		}
	}
}

export class SocialPreviewPage extends PreviewPage {}

export class SmsPreviewPage extends PreviewPage {}

export class IncentivePreviewPage extends PreviewPage {}

export class MemoryPromptPage extends Page {
	static getDefaults() {
		const defaults = {}
		return defaults
	}

	getImageSection() {
		var p = this.getSection((p) => {
			return p.type === "image" && p.name === this.name + "_img"
		})

		return p
			? p
			: this.createSection({ type: "image", company_id: this.company_id })
	}
	getBodySection() {
		var p = this.getSection((p) => {
			return p.type === "text" && p.name === this.name + "_text"
		})

		return p
			? p
			: this.createSection({ type: "text", company_id: this.company_id })
	}
	getNavSection() {
		var p = this.getSection((p) => {
			return p.type === "nav" && p.name === this.name + "_nav"
		})

		return p
			? p
			: this.createSection({ type: "nav", company_id: this.company_id })
	}
	setImageSection(section) {
		if (section.type === "image") {
			return this.setSection(section, (p) => {
				return p.type === "image" && p.name === this.name + "_img"
			})
		}
	}
	setBodySection(section) {
		if (section.type === "text") {
			return this.setSection(section, (p) => {
				return p.type === "text" && p.name === this.name + "_text"
			})
		}
	}
	setNavSection(section) {
		if (section.type === "nav") {
			return this.setSection(section, (p) => {
				return p.type === "nav" && p.name === this.name + "_nav"
			})
		}
	}
}

export class SharePage extends Page {
	static getDefaults() {
		const defaults = {}
		return defaults
	}

	getShareSection() {
		var p = this.getSection((p) => {
			return p.type === "share"
		})

		return p
			? p
			: this.createSection({ type: "share", company_id: this.company_id })
	}

	setShareSection(section) {
		if (section.type === "share") {
			return this.setSection(section, (p) => {
				return p.type === "share"
			})
		}
	}
}

export class ActionPagePage extends Page {
	static getDefaults() {
		const defaults = {}
		return defaults
	}

	getStorySection() {
		let p = this.getSection((p) => {
			return p.type === "story"
		})

		return p
			? p
			: this.createSection({ type: "story", company_id: this.company_id })
	}
	getBodySection() {
		let p = this.getSection((p) => {
			return p.type === "text" && p.name === "action_body"
		})

		return p
			? p
			: this.createSection({
					type: "text",
					name: "action_body",
					company_id: this.company_id,
			  })
	}
	getFooterSection() {
		let p = this.getSection((p) => {
			return p.type === "text" && p.name === "action_footer"
		})

		return p
			? p
			: this.createSection({
					type: "text",
					name: "action_footer",
					company_id: this.company_id,
			  })
	}

	setStorySection(section) {
		if (section.type === "story") {
			return this.setSection(section, (p) => {
				return p.type === "story"
			})
		}
	}
	setBodySection(section) {
		if (section.type === "text") {
			return this.setSection(section, (p) => {
				return p.type === "text" && p.name === "action_body"
			})
		}
	}
	setFooterSection(section) {
		if (section.type === "text") {
			return this.setSection(section, (p) => {
				return p.type === "text" && p.name === "action_footer"
			})
		}
	}
}
