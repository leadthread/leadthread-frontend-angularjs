import _ from "lodash"
import {
	VideoSection,
	PdfSection,
	ImageSection,
} from "../../../Core/Classes/Section"
import { CampaignTransformer } from "./CampaignTransformer"

export class V1TestimonialThreadCampaignTransformer extends CampaignTransformer {
	toCampaign(form) {
		return this.createCampaignInstance(form).then((campaign) => {
			campaign.is_phone_app = false
			campaign.contact_text_message = form.getFieldValue("uPMessage") // SMS To Contact [string]
			campaign.name = form.getFieldValue("campaignName")
			campaign.keyword = form.getFieldValue("campaignKeyword")
			campaign.channel = null
			campaign.content_sharing = true // Should Site Allow Testimonials [boolean]
			campaign.referral_text_message = form.getFieldValue("pRMessage") // SMS To Referral [String]

			var promise = []
			promise.push(this.$q.when(this.setBrand(campaign, form)))
			promise.push(this.$q.when(this.setIntroPage(campaign, form)))
			promise.push(this.$q.when(this.setSharePage(campaign, form)))
			promise.push(this.$q.when(this.setThankYouPage(campaign, form)))
			promise.push(this.$q.when(this.setActionPage(campaign, form)))

			return this.$q.all(promise).then(() => {
				this.campaign = campaign
				return campaign
			})
		})
	}

	toForm(campaign) {
		var form = this.createFormInstance(campaign)

		this.setNameFormField(form, campaign)
		this.setKeywordFormField(form, campaign)
		this.setBrandingFormFields(form, campaign)
		this.setUserContactMessageFormField(form, campaign)
		this.setContactReferralMessageFormField(form, campaign)

		// ----------------

		this.setIntroPageFormFields(form, campaign)
		this.setActionPageFormFields(form, campaign)
		return form
	}

	setIntroPage(campaign, form) {
		return this.getBrandColor(campaign, form).then((color) => {
			var res = campaign.site.getIntroPage()
			res.company_id = this.$stateParams.companyId
			res.name = "intro"
			res.order = 0
			res.background_color = "#ffffff"

			var media = res.getMediaSection()
			media.type = form.getFieldValue("mediaType")

			if (media.type == "image") {
				if (!(media instanceof ImageSection)) {
					media = this.SectionFactory.create(media)
				}
				media.file_id =
					form.getFieldValue("image") !== null
						? form.getFieldValue("image").id
						: null
				media.file =
					form.getFieldValue("image") !== null
						? form.getFieldValue("image")
						: null
			} else if (media.type == "video") {
				if (!(media instanceof VideoSection)) {
					media = this.SectionFactory.create(media)
				}
				media.video_id =
					form.getFieldValue("video") !== null
						? form.getFieldValue("video").id
						: null
				media.video =
					form.getFieldValue("video") !== null
						? form.getFieldValue("video")
						: null
			} else if (media.type == "pdf") {
				if (!(media instanceof PdfSection)) {
					media = this.SectionFactory.create(media)
				}
				media.file_id =
					form.getFieldValue("pdf") !== null
						? form.getFieldValue("pdf").id
						: null
				media.file =
					form.getFieldValue("pdf") !== null
						? form.getFieldValue("pdf")
						: null
			}

			if (
				media.type == "image" ||
				media.type == "video" ||
				media.type == "pdf"
			) {
				media.company_id = this.$stateParams.companyId
				media.name = "intro_media"
				media.order = 0
				media.padding_vertical = 0
				media.padding_horizontal = 0

				res.setMediaSection(media)
			}

			// push Header
			var hdr = res.getHeaderSection()
			hdr.company_id = this.$stateParams.companyId
			hdr.name = "intro_header"
			hdr.order = 1
			hdr.type = "text"
			hdr.text = "Share Your Experience!"
			hdr.background_color = color
			hdr.font_color = "#FFFFFF"
			hdr.font_size = 25
			hdr.padding_vertical = 5
			hdr.padding_horizontal = 5
			res.setHeaderSection(hdr)

			// push Text
			var txt = res.getBodySection()
			txt.company_id = this.$stateParams.companyId
			txt.name = "intro_body"
			txt.order = 2
			txt.type = "text"

			txt.text = form.getFieldValue("message")
			res.setBodySection(txt)

			// push testimonial
			var test = res.getTestimonialSection()
			test.company_id = this.$stateParams.companyId
			test.name = "intro_testimonial"
			test.order = 3
			test.type = "testimonial"
			test.padding_vertical = 14
			test.padding_horizontal = 14
			res.setTestimonialSection(test)

			campaign.site.setIntroPage(res)
		})
	}

	setThankYouPage(campaign, form) {
		this.getBrandColor(campaign, form).then((color) => {
			var res = campaign.site.getThankYouPage()

			res.name = "thanks"
			res.order = 6

			// thanks Header
			var hdr = res.getHeaderSection()
			hdr.company_id = this.$stateParams.companyId
			hdr.name = "thanks_header"
			hdr.order = 0
			hdr.type = "text"
			hdr.text = "Thank You!"
			hdr.background_color = color
			hdr.font_color = "#FFFFFF"
			hdr.font_size = 20
			hdr.padding_vertical = 5
			hdr.padding_horizontal = 5
			res.setHeaderSection(hdr)

			// thanks text
			var txt = res.getBodySection()
			txt.company_id = this.$stateParams.companyId
			txt.name = "thanks_body"
			txt.order = 1
			txt.type = "text"
			txt.text = "You're the best!"
			res.setBodySection(txt)

			campaign.site.setThankYouPage(res)
		})
	}

	setIntroPageFormFields(form, campaign) {
		var introPage = campaign.site.getIntroPage()
		var introBody = introPage.getBodySection()
		var introMedia = introPage.getMediaSection()

		form.setFieldValue(
			"message",
			introBody.text !== undefined
				? introBody.text
				: form.getFieldValue("message")
		)
		if (_.isInteger(introMedia.file_id)) {
			if (introMedia.file.mime == "application/pdf") {
				form.setFieldValue("mediaType", "pdf")
			} else {
				form.setFieldValue("mediaType", "image")
			}
		} else if (_.isInteger(introMedia.video_id)) {
			form.setFieldValue("mediaType", "video")
		} else {
			form.setFieldValue("mediaType", null)
		}

		if (introMedia instanceof ImageSection) {
			form.setFieldValue(
				"image",
				introMedia.file ? introMedia.file.valueOf() : null
			)
		} else if (introMedia instanceof VideoSection) {
			form.setFieldValue(
				"video",
				introMedia.video ? introMedia.video.valueOf() : null
			)
		} else if (introMedia instanceof PdfSection) {
			form.setFieldValue(
				"pdf",
				introMedia.file ? introMedia.file.valueOf() : null
			)
		}

		return form
	}
}
