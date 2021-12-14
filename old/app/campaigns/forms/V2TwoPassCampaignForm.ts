/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-02 09:44:35
*/
namespace lt {
	export abstract class V2TwoPassCampaignForm extends CampaignForm {
		public form: ICampaignFormForm;

		constructor(protected service: CampaignFormService, protected data: ICampaignForm) {
			super(service, data);
			this.type = this.getType();
			this.version = this.getVersion();
        }

        abstract getType(): string;
        abstract getVersion(): number;
        
        build(): ICampaignFormForm {
			let self = this;
			if (this.form) {
				return this.form;
			}

			let form: ICampaignFormForm = {};
			form["Step 1"] = this.getStepOne(this);
			form["Step 2"] = this.getStepTwo(this);
			form["Step 3"] = this.getStepThree(this);
			form["Step 4"] = this.getStepFour(this);
			
			this.form = _.cloneDeep(form);
			return this.form;
        }
        
        getStepOne(self: CampaignForm): ICampaignFormGroup {
            return {
				"Branding": <ICampaignFormSubGroup>{
					questions: this.brandingQuestions,
				}
			};
        }

        abstract getStepTwo(self: CampaignForm): ICampaignFormGroup;

        getStepThree(self: CampaignForm): ICampaignFormGroup {
            return {
				"Action Page": <ICampaignFormSubGroup>{
					description: "The Action Page is what your contacts will be sharing with their network.",
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
						value:"By clicking any button, you consent for [Company] to use automated technology, including pre-recorded messages and texts, to contact you at the number and email provided about [Company] offers. This consent is not required to make a purchase.",
						type:"textarea",
						placeholders: true,
						show:true,
						valid:true,
						required:false,
					}]
				},
			};
        }

        getStepFour(self: CampaignForm): ICampaignFormGroup {
            return {
				"Text Messages": <ICampaignFormSubGroup>{
					questions: [
						{
							description:"",
							displayName:"Message from You to the Forwarder",
							limitTo: 280,
							name:"uPMessage",
							note:"A link will be added automatically to the end of the text to allow the forwarder to preview the Action Page and share it with their network.",
							placeholders: false,
							show:true,
							type:"textarea",
							value:null,
							required: true,
							valid: function () {
								return _.isString(this.value) && this.value.length > 3;
							}
						},
						{
							description:"",
							displayName:"Message from the Forwarder to the Recipient",
							limitTo: 280,
							name:"pRMessage",
							note:"A link will be added automatically to the end of the text to allow Recipients to view the Action Page & contact the sales rep.",
							placeholders: false,
							required: true,
							show:true,
							type:"textarea",
							value:null,
							valid: function () {
								return _.isString(this.value) && this.value.length > 3;
							}
						}
					],
				}, 
			};
        }
	}	
	angular.module("lt.app").service("V2TwoPassCampaignForm", V2TwoPassCampaignForm);
}
