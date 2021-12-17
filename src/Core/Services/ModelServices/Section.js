/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:55:34
 */
///
import _ from "lodash"
import { ModelService } from "./Model"
import {
	CollectSection,
	ImageSection,
	IncentivePreviewSection,
	MailtoSection,
	NavSection,
	PdfSection,
	RegisterSection,
	ShareSection,
	SmsSection,
	SmsPreviewSection,
	SocialSection,
	SocialPreviewSection,
	StorySection,
	TelSection,
	TestimonialSection,
	VideoSection,
	TextSection,
	SpacerSection,
	UrlSection,
} from "../../Classes/Models/Section"

export class SectionService extends ModelService {
	resource = "sections"

	static $inject = ["$api", "$q", "FileService", "VideoService"]
	constructor($api, $q, FileService, VideoService) {
		super($api, $q)
		this.FileService = FileService
		this.VideoService = VideoService
		this.related.load.file = this.loadFile
		this.related.load.video = this.loadVideo
	}

	create = (_data) => {
		switch (_data.type) {
			case "collect":
				return CollectSection.create(this, _data)
			case "image":
				return ImageSection.create(this, _data)
			case "incentivepreview":
				return IncentivePreviewSection.create(this, _data)
			case "mailto":
				return MailtoSection.create(this, _data)
			case "nav":
				return NavSection.create(this, _data)
			case "pdf":
				return PdfSection.create(this, _data)
			case "register":
				return RegisterSection.create(this, _data)
			case "share":
				return ShareSection.create(this, _data)
			case "sms":
				return SmsSection.create(this, _data)
			case "smspreview":
				return SmsPreviewSection.create(this, _data)
			case "social":
				return SocialSection.create(this, _data)
			case "socialpreview":
				return SocialPreviewSection.create(this, _data)
			case "story":
				return StorySection.create(this, _data)
			case "tel":
				return TelSection.create(this, _data)
			case "testimonial":
				return TestimonialSection.create(this, _data)
			case "video":
				return VideoSection.create(this, _data)
			case "text":
				return TextSection.create(this, _data)
			case "spacer":
				return SpacerSection.create(this, _data)
			case "url":
				return UrlSection.create(this, _data)
			default:
				throw (
					"Unknown type for Section: " + _.get(_data, "type", "null")
				)
		}
	}

	loadVideo = (m) => {
		let x
		if (m.video_id) {
			x = this.VideoService.show(m.video_id)
		} else {
			x = this.$q.when(null)
		}
		return x.then(this.assignResult(m, "video", true))
	}

	loadFile = (m) => {
		let x
		if (m.file_id) {
			x = this.FileService.show(m.file_id)
		} else {
			x = this.$q.when(null)
		}
		return x.then(this.assignResult(m, "file", true))
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
}

export const module = { key: "SectionService", fn: SectionService }
