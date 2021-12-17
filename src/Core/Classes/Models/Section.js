/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-07-19 13:55:34
 */
///
import _ from "lodash"
import { Model } from "./Model"

export class Section extends Model {
	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		return {
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
		}
	}

	toString() {
		return this.name
	}

	valueOf() {
		return super.valueOf()
	}

	getDefaults() {
		return _.merge(super.getDefaults())
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
	static getDefaults() {
		return {
			...Section.getDefaults(),
			padding_horizontal: 0,
			padding_vertical: 0,
		}
	}
}
export class IncentivePreviewSection extends PreviewSection {}
export class SmsPreviewSection extends PreviewSection {}
export class SocialPreviewSection extends PreviewSection {}
