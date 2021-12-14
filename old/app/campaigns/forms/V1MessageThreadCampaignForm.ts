/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-02 09:44:32
*/
namespace lt {
	export class V1MessageThreadCampaignForm extends CampaignForm {
		constructor(protected service: CampaignFormService, protected data: ICampaignForm) {
			super(service, data);
			this.type = "message-thread";
			this.version = 1;
		}

		build(): ICampaignFormForm {
			let self = this;
			if (this.form) {
				return this.form;
			}

			let form: ICampaignFormForm = {};
			form["Step 1"] = <ICampaignFormGroup>{
				"Branding": {
					questions:this.brandingQuestions,
				},
			};

			form["Step 2"] = <ICampaignFormGroup>{
				"Action Page": {
					description: "The Action Page is what your customers will be sharing with their personal contacts. It’s your opportunity to show referrals what you do & make it easy for them to contact you.",
					questions: [{
						name:"defaultType",
						displayName:"Action Page Media",
						description:"",
						value:null,
						type:"select",
						section:{
							header:"CALL-TO-ACTION LANDING PAGE",
							text:"This will be the landing page your referral will see when they click the link in your customer's text message. It's your opportunity to promote your product/service and set a clear call-to-action."
						},
						options:[
							{
								name:"Image",
								value:"image"
							},
							{
								name:"Video",
								value:"video"
							},
							{
								name:"PDF",
								value:"pdf"
							}
						],
						show:true,
						required: true,
						valid: function () {
							return this.value === "image" || this.value === "video" || this.value === "pdf";
						},
					}, {
						name:"defaultImage",
						displayName:"Action Page Image",
						description:"",
						value:null,
						type:"imgupload",
						depend:{
							name:"defaultType",
							value:"image"
						},
						show:false,
						valid: function () {
							return this.value;
						},
						required: function () {
							return self.getFieldValue("defaultType") == "image";
						},
					}, {
						name:"defaultVideo",
						displayName:"Action Page Video",
						description:"",
						value:null,
						type:"vidupload",
						depend:{
							name:"defaultType",
							value:"video"
						},
						show:false,
						valid: function () {
							return this.value;
						},
						required: function () {
							return self.getFieldValue("defaultType") == "video";
						},
					}, {
						name:"defaultPDF",
						displayName:"Action Page PDF",
						description:"",
						value:null,
						type:"pdfupload",
						depend:{
							name:"defaultType",
							value:"pdf"
						},
						show:false,
						valid: function () {
							return this.value;
						},
						required: function () {
							return self.getFieldValue("defaultType") == "pdf";
						},
					}, {
						name:"landingText",
						displayName:"Action Page Message",
						description:"Message to the referral. (Information, Promotion, Incentives, etc.)",
						value:"Contact [Sender Full Name], if you’d like to learn more!",
						type:"textarea",
						placeholders: true,
						show:true,
						valid:true,
						required:true,
					}, {
						name:"callToActionButtons",
						displayName:"Call-To-Action Buttons",
						description:"",
						value: null,
						type:"cta-buttons",
						options: {
						},
						show:true,
						valid: true,
						required: function () {
							return _.isArray(this.value) && this.value.length > 0;
						},
					}, {
						name:"footer",
						displayName:"Footer",
						description:"",
						value:"By clicking any button, you consent for [Company] to use automated technology, including pre-recorded messages and texts, to contact you at the number and email provided about [Company] offers. This consent is not required to make a purchase.<br><br>Message and data rates may apply. Msg frequency varies.<br>Reply S to Stop. Reply RESEND if link doesn't work.<br>https://yaptive.com/terms-conditions - https://yaptive.com/privacy-policy",
						type:"textarea",
						placeholders: true,
						show:true,
						valid:true,
						required:false,
					}]
				},
			};

			form["Step 3"] = <ICampaignFormGroup>{
				"Text Messages": {
					questions:[{
						name:"uPMessage",
						displayName:"Message from You to Recipient",
						description:"",
						note:"This is the introductory text. The campaign text will follow.",
						limitTo: 280,
						value:null,
						type:"textarea",
						placeholders: false,
						show:true,
						required: true,
						valid: function () {
							return _.isString(this.value) && this.value.length > 3;
						}
					}],
				}, 
			};

			this.form = _.cloneDeep(form);
			return this.form;
		}
	}	
	angular.module("lt.app").service("V1MessageThreadCampaignForm", V1MessageThreadCampaignForm);
}
