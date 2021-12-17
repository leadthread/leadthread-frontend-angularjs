/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:55:34
 */
///
import _ from "lodash"
import { Model, ModelFactory, ModelService } from "./Model"

export class Section extends Model {
	background_color
	button_border_color
	button_border_radius
	button_border_width
	button_color
	button_icon
	company_id
	email
	file
	file_id
	font_color
	font_size
	name
	order
	padding_horizontal
	padding_vertical
	phone
	success_message
	text
	text_align
	type
	url
	icon
	video
	video_id

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.name
	}

	valueOf() {
		return super.valueOf()
	}

	getDefaults() {
		return _.merge(super.getDefaults(), {
			background_color: "#FFFFFF",
			button_border_color: "#666666",
			button_border_radius: 10,
			button_border_width: 1,
			button_color: "#FFFFFF",
			button_icon: null,
			company_id: null,
			font_color: "#666666",
			font_size: 16,
			padding_horizontal: 14,
			padding_vertical: 14,
			text_align: "center",
			success_message: null,
			type: null,
			icon: null,
		})
	}
}

export class SpacerSection extends Section {}
export class TextSection extends Section {}
export class TestimonialSection extends Section {}

// Forwarding
export class ForwardingSection extends Section {}
export class SocialSection extends ForwardingSection {}
export class CollectSection extends ForwardingSection {}
export class ShareSection extends ForwardingSection {}

// Media
export class MediaSection extends Section {}
export class StorySection extends MediaSection {}
export class ImageSection extends MediaSection {}
export class DocumentSection extends MediaSection {}
export class PdfSection extends DocumentSection {}
export class VideoSection extends MediaSection {}

// Buttons
export class ButtonSection extends Section {}
export class RegisterSection extends ButtonSection {}
export class TelSection extends ButtonSection {}
export class SmsSection extends ButtonSection {}
export class UrlSection extends ButtonSection {}
export class MailtoSection extends ButtonSection {}
export class NavSection extends ButtonSection {}

// Preview Section
export class PreviewSection extends Section {
	getDefaults() {
		return _.merge(super.getDefaults(), {
			padding_horizontal: 0,
			padding_vertical: 0,
		})
	}
}
export class IncentivePreviewSection extends PreviewSection {}
export class SmsPreviewSection extends PreviewSection {}
export class SocialPreviewSection extends PreviewSection {}

export class SectionFactory extends ModelFactory {
	static $inject = ["SectionService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class SectionService extends ModelService {
	resource = "sections"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
		this.related.load.file = this.loadFile
		this.related.load.video = this.loadVideo
	}

	create = (_data) => {
		switch (_data.type) {
			case "collect":
				return new CollectSection(this, _data)
			case "image":
				return new ImageSection(this, _data)
			case "incentivepreview":
				return new IncentivePreviewSection(this, _data)
			case "mailto":
				return new MailtoSection(this, _data)
			case "nav":
				return new NavSection(this, _data)
			case "pdf":
				return new PdfSection(this, _data)
			case "register":
				return new RegisterSection(this, _data)
			case "share":
				return new ShareSection(this, _data)
			case "sms":
				return new SmsSection(this, _data)
			case "smspreview":
				return new SmsPreviewSection(this, _data)
			case "social":
				return new SocialSection(this, _data)
			case "socialpreview":
				return new SocialPreviewSection(this, _data)
			case "story":
				return new StorySection(this, _data)
			case "tel":
				return new TelSection(this, _data)
			case "testimonial":
				return new TestimonialSection(this, _data)
			case "video":
				return new VideoSection(this, _data)
			case "text":
				return new TextSection(this, _data)
			case "spacer":
				return new SpacerSection(this, _data)
			case "url":
				return new UrlSection(this, _data)
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
