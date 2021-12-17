import _ from "lodash"

import { CampaignForm } from "./CampaignForm"

export class V1TestimonialThreadCampaignForm extends CampaignForm {
	constructor(service, data) {
		super(service, data)
		this.type = "testimonial-thread"
		this.version = 1
	}

	build() {
		let self = this

		if (this.form) {
			return this.form
		}

		let form = {}
		form["Start"] = {
			Branding: {
				questions: this.brandingQuestions,
			},
		}
		form["Sales Rep Experience"] = {
			"Customer Text Message": {
				questions: [
					{
						name: "uPMessage",
						displayName:
							"Message from the sales rep to the customer.",
						description:
							"This is your text message to your customer, inviting them to share referrals. A link will be added to help them start inviting.",
						value: null,
						type: "textarea",
						limitTo: 280,
						placeholders: false,
						show: true,
						required: true,
						valid: function () {
							return (
								_.isString(this.value) && this.value.length > 20
							)
						},
					},
					{
						name: "pRMessage",
						displayName: "Message from customer to the referral",
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
		form["Customer Experience"] = {
			"Intro Page": {
				questions: [
					{
						name: "message",
						displayName: "Intro Page Body",
						section: {
							header: "INTRODUCTION PAGE",
							text: "This will be the first page your customer will see when they click the link in your text message. It's your opportunity to outline your referral program and promote an incentive (optional).",
						},
						description: "What do you want to say to the customer?",
						value: "The best compliment you can give is a referral and we’ve made it easy to share your buying experience with your contacts.\nThanks for spreading the word!",
						type: "textarea",
						placeholders: true,
						show: true,
						valid: true,
						required: true,
					},
					{
						name: "mediaType",
						displayName: "Intro Page Media",
						description: "Upload image or video",
						value: null,
						type: "select",
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
						depend: {
							name: "includeMedia",
							value: true,
						},
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
						name: "image",
						displayName: "Intro Page Image",
						description: "Attach an image",
						value: null,
						type: "imgupload",
						depend: {
							name: "mediaType",
							value: "image",
						},
						valid: function () {
							return this.value
						},
						required: function () {
							return self.getFieldValue("mediaType") == "image"
						},
						show: false,
					},
					{
						name: "video",
						displayName: "Intro Page Video",
						description: "Attach a video",
						value: null,
						type: "vidupload",
						depend: {
							name: "mediaType",
							value: "video",
						},
						valid: function () {
							return this.value
						},
						required: function () {
							return self.getFieldValue("mediaType") == "video"
						},
						show: false,
					},
					{
						name: "pdf",
						displayName: "Intro Page PDF",
						description: "Attach a PDF",
						value: null,
						type: "pdfupload",
						depend: {
							name: "mediaType",
							value: "pdf",
						},
						valid: function () {
							return this.value
						},
						required: function () {
							return self.getFieldValue("mediaType") == "pdf"
						},
						show: false,
					},
				],
			},
		}
		form["Referral Experience"] = {
			"Action Page": {
				questions: [
					{
						name: "landingText",
						displayName: "Action Page Text Body",
						description:
							"Message to the referral. (Information, Promotion, Incentives, etc.)",
						value: "[Customer First Name] was helped by [sales rep full name] with [company]. Call today to learn more!",
						type: "textarea",
						placeholders: true,
						show: true,
						valid: true,
						required: true,
					},
					{
						name: "defaultType",
						displayName: "Action Page Media",
						value: null,
						type: "select",
						section: {
							header: "CALL-TO-ACTION LANDING PAGE",
							text: "This will be the landing page your referral will see when they click the link in your customer's text message. It's your opportunity to promote your product/service and set a clear call-to-action.",
						},
						description: "Default video or image.",
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
							return !_.isEmpty(this.value)
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
							return !_.isEmpty(this.value)
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
							return !_.isEmpty(this.value)
						},
						required: function () {
							return self.getFieldValue("defaultType") == "pdf"
						},
					},
					{
						name: "callToActionButtons",
						displayName: "Call-To-Action Buttons",
						description: "",
						value: null,
						type: "cta-buttons",
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

		this.form = _.cloneDeep(form)
		return this.form
	}
}

export const module = {
	key: "V1TestimonialThreadCampaignForm",
	fn: V1TestimonialThreadCampaignForm,
}
