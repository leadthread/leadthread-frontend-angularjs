import _ from "lodash"
import { CampaignTransformer } from "./CampaignTransformer"

export class V2TwoPassCampaignTransformer extends CampaignTransformer {
	toCampaign(form) {
		return this.createCampaignInstance(form).then((campaign) => {
			campaign.is_phone_app = false
			campaign.contact_text_message = form.getFieldValue("uPMessage")
			campaign.referral_text_message = form.getFieldValue("pRMessage")
			campaign.name = form.getFieldValue("campaignName")
			campaign.keyword = form.getFieldValue("campaignKeyword")
			campaign.channel = "sms"
			campaign.content_sharing = false

			var promises = this.buildPages(campaign, form)

			return this.$q.all(promises).then(() => {
				this.campaign = campaign
				return campaign
			})
		})
	}

	buildPages(campaign, form) {
		var promise = []
		promise.push(this.$q.when(this.setBrand(campaign, form)))
		promise.push(this.$q.when(this.setIntroPage(campaign, form)))
		promise.push(this.$q.when(this.setSharePage(campaign, form)))
		promise.push(this.$q.when(this.setActionPage(campaign, form)))
		promise.push(this.$q.when(this.setIncentive(campaign, form)))
		return promise
	}

	toForm(campaign) {
		var form = this.createFormInstance(campaign)

		this.setNameFormField(form, campaign)
		this.setKeywordFormField(form, campaign)
		this.setBrandingFormFields(form, campaign)
		this.setIntroPageFormFields(form, campaign)
		this.setUserContactMessageFormField(form, campaign)
		this.setContactReferralMessageFormField(form, campaign)
		this.setIncentiveFormField(form, campaign)

		// ----------------

		this.setActionPageFormFields(form, campaign)

		return form
	}

	setIntroPageFormFields(form, campaign) {
		let page = campaign.site.getIntroPage()
		let section

		section = page.getSection({ name: "description_title" })
		if (section) {
			form.setFieldValue("descriptionTitle", section.text)
		}

		section = page.getSection({ name: "description_body" })
		if (section) {
			form.setFieldValue("descriptionBody", section.text)
		}
	}

	setIntroPage(campaign, form) {
		return this.getBrandColor(campaign, form).then((color) => {
			let order = 0
			let page = campaign.site.getIntroPage()

			page.site_id = campaign.site_id
			page.company_id = campaign.company_id
			page.name = page.type

			//** Description **
			// Spacer
			page.addSection(
				{
					name: "description_spacer_brand",
					type: "spacer",
				},
				{
					order: order++,
					background_color: "#FFFFFF",
					font_color: color,
				}
			)

			// Title
			page.addSection(
				{
					name: "description_title",
					type: "text",
				},
				{
					order: order++,
					text: form.getFieldValue("descriptionTitle"),
					text_align: "left",
					padding_vertical: 0,
					font_size: 24,
					icon: this.getIntroPageTitleIcon(),
				}
			)

			// Body
			page.addSection(
				{
					name: "description_body",
					type: "text",
				},
				{
					order: order++,
					text: form.getFieldValue("descriptionBody"),
					text_align: "left",
					padding_vertical: 0,
				}
			)

			//** Incentive **
			if (form.getFieldValue("incentiveChoice")) {
				// Spacer
				page.addSection(
					{
						name: "incentive_spacer",
						type: "spacer",
					},
					{
						order: order++,
						font_color: "#DDDDDD",
					}
				)

				// Title
				page.addSection(
					{
						name: "incentive_title",
						type: "text",
					},
					{
						order: order++,
						text: "Your Reward",
						text_align: "left",
						padding_vertical: 0,
						font_size: 24,
						background_color: "#FFFFFF",
						icon: "dollar",
					}
				)

				// Body
				page.addSection(
					{
						name: "incentive_body",
						type: "text",
					},
					{
						order: order++,
						text: form.getFieldValue("incentiveText"),
						text_align: "left",
						padding_vertical: 0,
						background_color: "#FFFFFF",
					}
				)
			} else {
				page.deleteSection({ name: "incentive_spacer", type: "spacer" })
				page.deleteSection({ name: "incentive_title", type: "text" })
				page.deleteSection({ name: "incentive_body", type: "text" })
			}

			this.setShareSections(campaign, form, page, order)

			campaign.site.setIntroPage(page)
		})
	}

	setSharePage(campaign, form) {
		let page = campaign.site.getSharePage()
		page.company_id = this.$stateParams.companyId
		page.name = "share"
		page.order = 4
		page.background_color = "#ffffff"
		let order = 0

		// Title
		page.addSection(
			{
				name: "share_title",
				type: "text",
			},
			{
				order: order++,
				text: "Share",
				text_align: "left",
				padding_vertical: 0,
				font_size: 24,
				icon: "share-alt",
			}
		)

		// Instructions
		page.addSection(
			{
				name: "share_description",
				type: "text",
			},
			{
				order: order++,
				text: "We've made it easy, click a button below to share with your contacts.",
				text_align: "left",
			}
		)

		// Module
		page.addSection(
			{
				name: "share",
				type: "share",
			},
			{
				order: order++,
				text_align: "left",
			}
		)

		campaign.site.setSharePage(page)
	}

	setActionPageButtonFormField(campaign, form) {
		let page = campaign.action_page.site.getActionPagePage()
		let buttons = page.getButtonSections("action_button_")
		let buttonArr = campaign.id
			? []
			: form.getFieldValue("callToActionButtons")

		_.forEach(buttons, function (button) {
			if (_.isString(button.url)) {
				let idx1 = button.url.indexOf("http://")
				let idx2 = button.url.indexOf("https://")
				if (idx1 === -1 && idx2 === -1) {
					button.url = "http://" + button.url
				}
			}
			buttonArr.push({
				button_icon: button.button_icon,
				success_message: button.success_message,
				email: button.email,
				phone: button.phone,
				text: button.text,
				type: button.type,
				url: button.url,
			})
		})

		form.setFieldValue("callToActionButtons", buttonArr)
	}
}

export const module = {
	key: "V2TwoPassCampaignTransformer",
	fn: V2TwoPassCampaignTransformer,
}
