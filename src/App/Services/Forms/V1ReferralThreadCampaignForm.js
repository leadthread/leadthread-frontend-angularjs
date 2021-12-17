import _ from "lodash"

import { CampaignForm } from "./CampaignForm"

export class V1ReferralThreadCampaignForm extends CampaignForm {
	form

	constructor(service, data) {
		super(service, data)
		this.type = "referral-thread"
		this.version = 1
	}

	build() {
		let self = this
		if (this.form) {
			return this.form
		}

		let form = {}
		form["Step 1"] = {
			Branding: {
				questions: self.brandingQuestions,
			},
		}
		form["Step 2"] = {
			"Action Page": {
				description:
					"The Action Page is what your customers will be sharing with their personal contacts. It’s your opportunity to show referrals what you do & make it easy for them to contact you.",
				questions: [
					{
						name: "defaultType",
						displayName: "Action Page Media",
						description: "",
						value: null,
						type: "select",
						section: {
							header: "CALL-TO-ACTION LANDING PAGE",
							text: "This will be the landing page your referral will see when they click the link in your customer's text message. It's your opportunity to promote your product/service and set a clear call-to-action.",
						},
						options: [
							{
								name: "Image",
								value: "image",
							},
							{
								name: "Video",
								value: "video",
							},
							{
								name: "PDF",
								value: "pdf",
							},
						],
						show: true,
						required: true,
						valid: function () {
							return (
								this.value === "image" ||
								this.value === "video" ||
								this.value === "pdf"
							)
						},
					},
					{
						name: "defaultImage",
						displayName: "Action Page Image",
						description: "",
						value: null,
						type: "imgupload",
						depend: {
							name: "defaultType",
							value: "image",
						},
						show: false,
						valid: function () {
							return this.value
						},
						required: function () {
							return self.getFieldValue("defaultType") == "image"
						},
					},
					{
						name: "defaultVideo",
						displayName: "Action Page Video",
						description: "",
						value: null,
						type: "vidupload",
						depend: {
							name: "defaultType",
							value: "video",
						},
						show: false,
						valid: function () {
							return this.value
						},
						required: function () {
							return self.getFieldValue("defaultType") == "video"
						},
					},
					{
						name: "defaultPDF",
						displayName: "Action Page PDF",
						description: "",
						value: null,
						type: "pdfupload",
						depend: {
							name: "defaultType",
							value: "pdf",
						},
						show: false,
						valid: function () {
							return this.value
						},
						required: function () {
							return self.getFieldValue("defaultType") == "pdf"
						},
					},
					{
						name: "landingText",
						displayName: "Action Page Message",
						description:
							"Message to the referral. (Information, Promotion, Incentives, etc.)",
						value: "Contact [Sender Full Name], if you’d like to learn more!",
						type: "textarea",
						placeholders: true,
						show: true,
						valid: true,
						required: true,
					},
					{
						name: "callToActionButtons",
						displayName: "Call-To-Action Buttons",
						description: "",
						value: null,
						type: "cta-buttons",
						options: {},
						show: true,
						valid: true,
						required: function () {
							return (
								_.isArray(this.value) && this.value.length > 0
							)
						},
					},
					{
						name: "footer",
						displayName: "Footer",
						description: "",
						value: "By clicking any button, you consent for [Company] to use automated technology, including pre-recorded messages and texts, to contact you at the number and email provided about [Company] offers. This consent is not required to make a purchase.",
						type: "textarea",
						placeholders: true,
						show: true,
						valid: true,
						required: false,
					},
				],
			},
		}
		form["Step 3"] = {
			"Text Messages": {
				questions: [
					{
						description: "",
						displayName: "Message from You to Person Giving Intro",
						limitTo: 280,
						name: "uPMessage",
						note: "A link will be added automatically to the end of the text to allow the person giving the intro to preview the Action Page and share.",
						placeholders: false,
						show: true,
						type: "textarea",
						value: null,
						required: true,
						valid: function () {
							return (
								_.isString(this.value) && this.value.length > 3
							)
						},
					},
					{
						name: "pRMessage",
						displayName:
							"Message from Person Giving Intro to Referrals",
						description: "",
						note: "A link will be added automatically to the end of the text to allow Referrals to view the Action page & contact the sales rep.",
						value: null,
						type: "textarea",
						limitTo: 280,
						placeholders: false,
						show: true,
						required: true,
						valid: function () {
							return (
								_.isString(this.value) && this.value.length > 3
							)
						},
					},
				],
			},
		}

		form["Step 4"] = {
			Incentive: {
				questions: [
					{
						name: "incentiveChoice",
						displayName: "Would you like to include an incentive?",
						description: "",
						value: null,
						type: "select",
						options: [
							{
								name: "Yes",
								value: true,
							},
							{
								name: "No",
								value: false,
							},
						],
						show: true,
						required: true,
						valid: function () {
							return _.isBoolean(this.value)
						},
					},
					{
						name: "incentiveText",
						displayName: "Incentive to Share",
						description:
							"A message to incentivize your contacts to share this action page.",
						value: "",
						type: "textarea",
						depend: {
							name: "incentiveChoice",
							value: true,
						},
						placeholders: false,
						show: true,
						valid: true,
						required: false,
					},
					{
						name: "incentiveMediaType",
						displayName: "Incentive Image/Video",
						description:
							"An image or video to describe your incentive",
						value: null,
						type: "select",
						depend: {
							name: "incentiveChoice",
							value: true,
						},
						options: [
							{
								name: "None",
								value: null,
							},
							{
								name: "Image",
								value: "App\\Models\\File",
							},
							{
								name: "Video",
								value: "App\\Models\\Video",
							},
						],
						show: true,
						required: false,
						valid: function () {
							return (
								this.value === "App\\Models\\Video" ||
								this.value === "App\\Models\\File"
							)
						},
					},
					{
						name: "incentiveMediaImage",
						displayName: "Incentive Image",
						description: "",
						value: null,
						type: "imgupload",
						depend: [
							{
								name: "incentiveChoice",
								value: true,
							},
							{
								name: "incentiveMediaType",
								value: "App\\Models\\File",
							},
						],
						show: false,
						valid: function () {
							return this.value
						},
						required: function () {
							return (
								self.getFieldValue("incentiveMediaType") ==
								"App\\Models\\File"
							)
						},
					},
					{
						name: "incentiveMediaVideo",
						displayName: "Incentive Video",
						description: "",
						value: null,
						type: "vidupload",
						depend: [
							{
								name: "incentiveChoice",
								value: true,
							},
							{
								name: "incentiveMediaType",
								value: "App\\Models\\Video",
							},
						],
						show: false,
						valid: function () {
							return this.value
						},
						required: function () {
							return (
								self.getFieldValue("incentiveMediaType") ==
								"App\\Models\\Video"
							)
						},
					},
				],
			},
		}

		this.form = _.cloneDeep(form)
		return this.form
	}
}

export const module = {
	key: "V1ReferralThreadCampaignForm",
	fn: V1ReferralThreadCampaignForm,
}
