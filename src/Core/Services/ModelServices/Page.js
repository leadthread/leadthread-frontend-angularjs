/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:56:00
 */
///
import _ from "lodash"
import { ModelService } from "./Model"
import {
	ActionPagePage,
	IntroPage,
	SharePage,
	SmsPreviewPage,
	IncentivePreviewPage,
	SocialPreviewPage,
	ThankYouPage,
} from "../../Classes/Models/Page"

export class PageService extends ModelService {
	resource = "pages"

	static $inject = ["$api", "$q", "SectionService", "SectionFactory"]
	constructor($api, $q, SectionService, SectionFactory) {
		super($api, $q)
		this.SectionService = SectionService
		this.SectionFactory = SectionFactory
		this.related.load.sections = this.loadSections
		this.related.save.after.sections = this.saveSections
	}

	create = (_data) => {
		switch (_data.type) {
			case "action":
				return ActionPagePage.create(this, _data)
			case "intro":
				return IntroPage.create(this, _data)
			case "share":
				return SharePage.create(this, _data)
			case "smspreview":
				return SmsPreviewPage.create(this, _data)
			case "incentivepreview":
				return IncentivePreviewPage.create(this, _data)
			case "socialpreview":
				return SocialPreviewPage.create(this, _data)
			case "thank":
				return ThankYouPage.create(this, _data)
			default:
				throw "Unknown type for Page: " + _.get(_data, "type", "null")
		}
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

	loadSections = (m) => {
		return this.SectionService.indexFor(this.resource, m.id).then(
			this.assignResult(m, "sections")
		)
	}

	deleteSections(m, find) {
		let sections = m.getSections(find)
		let promises = []

		if (sections) {
			promises = _.map(sections, (section) => {
				return section.destroy()
			})
		}

		return this.$q.all(promises).then(() => {
			_.remove(m.sections, find)
			return true
		})
	}

	createSection(_data) {
		return this.SectionFactory.create(_data)
	}

	saveSections = (m, include) => {
		let p = []
		_.forEach(m.sections, (sections) => {
			p.push(
				this.SectionService.saveFor(
					this.resource,
					m.id,
					sections,
					include
				)
			)
		})
		return this.$q.all(p)
	}
}

export const module = { key: "PageService", fn: PageService }
