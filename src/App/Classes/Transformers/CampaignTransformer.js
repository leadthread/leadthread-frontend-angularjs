import _ from "lodash"

export class CampaignTransformer {
	campaign
	form

	//Dependencies
	static $inject = [
		"$q",
		"$company",
		"$stateParams",
		"CampaignFormFactory",
		"CampaignFactory",
		"SectionFactory",
		"IncentiveService",
	]
	constructor(
		$q,
		$company,
		$stateParams,
		CampaignFormFactory,
		CampaignFactory,
		SectionFactory,
		IncentiveService
	) {}

	getCampaignInstance() {
		return this.campaign
	}

	createFormInstance(campaign) {
		if (this.form) {
			return this.form
		}

		this.campaign = campaign

		let x = {
			type: campaign.type,
			version: campaign.version,
		}

		return this.CampaignFormFactory.create(x)
	}

	createCampaignInstance(form) {
		let x = null
		if (this.campaign) {
			x = this.campaign
		} else {
			this.form = form
			x = this.CampaignFactory.create({ type: form.type })
		}

		return this.$q.when(x)
	}

	setNameFormField(form, campaign) {
		form.setFieldValue("campaignName", campaign.name)
	}

	setKeywordFormField(form, campaign) {
		form.setFieldValue("campaignKeyword", campaign.keyword)
	}

	setBrandingFormFields(form, campaign) {
		form.setFieldValue("campaignBrand", campaign.brand)
		return this.$q.when(true)
	}

	setUserContactMessageFormField(form, campaign) {
		form.setFieldValue(
			"uPMessage",
			campaign.contact_text_message === undefined
				? form.getFieldValue("uPMessage")
				: campaign.contact_text_message
		) // SMS To Contact [string)]
	}

	setContactReferralMessageFormField(form, campaign) {
		form.setFieldValue(
			"pRMessage",
			_.isEmpty(campaign.referral_text_message)
				? form.getFieldValue("pRMessage")
				: campaign.referral_text_message
		) // SMS To Referral [String]
	}

	setActionPageFormFields(form, campaign) {
		// Action Page Loading
		let actionPage = campaign.action_page.site.getActionPagePage()
		let actionStory = actionPage.getStorySection()
		let actionBody = actionPage.getBodySection()
		let actionFooter = actionPage.getFooterSection()

		if (_.isInteger(actionStory.file_id)) {
			if (actionStory.file.mime == "application/pdf") {
				form.setFieldValue("defaultType", "pdf")
			} else {
				form.setFieldValue("defaultType", "image")
			}
		} else if (_.isInteger(actionStory.video_id)) {
			form.setFieldValue("defaultType", "video")
		} else {
			form.setFieldValue("defaultType", null)
		}

		if (_.isInteger(actionStory.file_id)) {
			if (actionStory.file.mime == "application/pdf") {
				form.setFieldValue("defaultPDF", actionStory.file.valueOf())
			} else {
				form.setFieldValue("defaultImage", actionStory.file.valueOf()) // Introduction Page Image Value [file)]
			}
		} else if (_.isInteger(actionStory.video_id)) {
			form.setFieldValue("defaultVideo", actionStory.video.valueOf()) // Introduction Page Video Value [video)]
		}

		form.setFieldValue(
			"landingText",
			actionBody.text === undefined
				? form.getFieldValue("landingText")
				: actionBody.text
		) // Action Page Landing Body Text [string)]
		form.setFieldValue(
			"footer",
			actionFooter.text === undefined
				? form.getFieldValue("footer")
				: actionFooter.text
		) // Action Page Landing Body Text [string)]

		this.setActionPageButtonFormField(campaign, form)
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

	setBrand(campaign, form) {
		campaign.brand = form.getFieldValue("campaignBrand")
		campaign.brand_id = _.get(campaign, "brand.id")
		campaign.action_page.brand = campaign.brand
		campaign.action_page.brand_id = campaign.brand_id
	}

	setActionPage(campaign, form) {
		let self = this

		this.$q
			.all({
				company_id: this.$company.getId(),
				color: this.getBrandColor(campaign, form),
			})
			.then(function (x) {
				let action = campaign.action_page.site
				let actionPage = action.getActionPagePage()
				actionPage.company_id = x.company_id
				actionPage.name = "action"
				actionPage.order = 0
				actionPage.background_color = "#ffffff"

				let actionStory = actionPage.getStorySection()
				actionStory.name = "action_story"
				actionStory.order = 0
				actionStory.background_color = "#FFFFFF"
				actionStory.font_color = "#666"
				actionStory.file_id = null
				actionStory.file = null
				actionStory.video_id = null
				actionStory.video = null

				let value
				switch (form.getFieldValue("defaultType")) {
					case "image":
						value = form.getFieldValue("defaultImage")
						if (value) {
							actionStory.file_id = value.id
							actionStory.file = value
							actionStory.video = actionStory.video_id = null
						}
						break
					case "video":
						value = form.getFieldValue("defaultVideo")
						if (value) {
							actionStory.video_id = value.id
							actionStory.video = value
							actionStory.file = actionStory.file_id = null
						}
						break
					case "pdf":
						value = form.getFieldValue("defaultPDF")
						if (value) {
							actionStory.file_id = value.id
							actionStory.file = value
							actionStory.video = actionStory.video_id = null
						}
						break
				}

				actionStory.padding_vertical = 0
				actionStory.padding_horizontal = 0
				actionPage.setStorySection(actionStory)

				let actionText = actionPage.getBodySection()
				actionText.name = "action_body"
				actionText.order = 1
				actionText.text = form.getFieldValue("landingText") // Action Page Landing Body Text [string]
				actionPage.setBodySection(actionText)

				let buttons = actionPage.getButtonSections()

				_.forEach(buttons, function (button, i) {
					let s = form.getFieldValue("callToActionButtons")[i]

					if (!s) {
						actionPage.deleteSections(function (s) {
							return s.name === "action_button_" + i
						})
					}
				})

				_.forEach(
					form.getFieldValue("callToActionButtons"),
					function (button, i) {
						let name = "action_button_" + i
						let find = function (s) {
							return s.name === name
						}
						let actionButton = actionPage.getButtonSection(find)

						actionButton.name = name
						actionButton.order = 2 + parseInt(i)
						actionButton.button_border_color = x.color
						actionButton.button_color = x.color
						actionButton.font_color = "#FFFFFF"
						actionButton.font_size = 20
						actionButton.text = button.text
						actionButton.button_icon = button.button_icon
						actionButton.success_message = button.success_message
						actionButton.type = button.type
						actionButton.phone = button.phone
						actionButton.url = null
						actionButton.email = null

						switch (
							actionButton.type // Call To Action Button Type ['tel', 'sms', 'url']
						) {
							case "tel":
								actionPage.setButtonSection(
									find,
									self.SectionFactory.create(
										actionButton.valueOf()
									)
								)
								break
							case "sms":
								actionPage.setButtonSection(
									find,
									self.SectionFactory.create(
										actionButton.valueOf()
									)
								)
								break
							case "url":
								actionButton.url = button.url
								if (_.isString(actionButton.url)) {
									let idx1 =
										actionButton.url.indexOf("http://")
									let idx2 =
										actionButton.url.indexOf("https://")
									if (idx1 === -1 && idx2 === -1) {
										actionButton.url =
											"http://" + actionButton.url
									}
								}
								actionPage.setButtonSection(
									find,
									self.SectionFactory.create(
										actionButton.valueOf()
									)
								)
								break
							case "mailto":
								actionButton.email = button.email
								actionPage.setButtonSection(
									find,
									self.SectionFactory.create(
										actionButton.valueOf()
									)
								)
								break
							case "nav":
							default:
								// Do nothing
								break
						}
					}
				)

				let footer = actionPage.getFooterSection()
				footer.name = "action_footer"
				footer.order = 30
				footer.font_size = 10
				footer.text = form.getFieldValue("footer") // Action Page Landing Footer Text [string]
				actionPage.setFooterSection(footer)

				action.setActionPagePage(actionPage)
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

	getBrandColor(campaign, form) {
		let color = _.get(campaign, "brand.color")

		if (!color) {
			color = this.$company.getColor()
		}

		return this.$q.when(color)
	}

	setIncentive(campaign, form) {
		let choice = form.getFieldValue("incentiveChoice")

		if (choice !== true) {
			campaign.incentive_id = null
			campaign.incentive = null
		} else {
			campaign.incentive =
				campaign.incentive ||
				this.IncentiveService.create({ text: null })
			campaign.incentive.text = form.getFieldValue("incentiveText")

			let type = (campaign.incentive.media_type =
				form.getFieldValue("incentiveMediaType"))

			if (type === "App\\Models\\File") {
				campaign.incentive.media = form.getFieldValue(
					"incentiveMediaImage"
				)
				campaign.incentive.media_id = _.get(
					campaign,
					"incentive.media.id"
				)
			} else if (type === "App\\Models\\Video") {
				campaign.incentive.media = form.getFieldValue(
					"incentiveMediaVideo"
				)
				campaign.incentive.media_id = _.get(
					campaign,
					"incentive.media.id"
				)
			} else if (type === null) {
				campaign.incentive.media = null
				campaign.incentive.media_id = null
			} else {
				throw "Unknown media type for incentive: " + type
			}
		}
	}

	setIncentiveFormField(form, campaign) {
		let type = _.get(campaign, "incentive.media_type")
		let enabled = !!campaign.incentive_id
		form.setFieldValue("incentiveMediaImage", null)
		form.setFieldValue("incentiveMediaType", null)
		form.setFieldValue("incentiveMediaVideo", null)
		form.setFieldValue("incentiveText", null)
		form.setFieldValue("incentiveChoice", enabled)

		if (enabled) {
			form.setFieldValue(
				"incentiveText",
				_.get(campaign, "incentive.text")
			)
			form.setFieldValue("incentiveMediaType", type)
			if (type === "App\\Models\\File") {
				form.setFieldValue(
					"incentiveMediaImage",
					campaign.incentive.media
				)
			} else if (type === "App\\Models\\Video") {
				form.setFieldValue(
					"incentiveMediaVideo",
					campaign.incentive.media
				)
			}
		}
	}
}
