/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-02 09:44:35
*/
/// <reference path="V2TwoPassCampaignForm.ts" />
namespace lt {
	export class V2ReferralThreadCampaignForm extends V2TwoPassCampaignForm {
		getType(): string {
			return "referral-thread"
		}

		getVersion(): number {
			return 2;
		}

        getStepTwo(self: CampaignForm): ICampaignFormGroup {
            return {
				"Share Page": <ICampaignFormSubGroup>{
					questions: [{
						name:"descriptionTitle",
						displayName:"Introduction Title",
						description:"An introduction to the person that will share their experience via video or image.",
						value:"Refer a Friend!",
						type:"text",
						placeholders: false,
						show:true,
						valid:true,
						required:true,
					}, {
						name:"descriptionBody",
						displayName:"Introduction Body",
						description:"",
						value:"Hello [Customer First Name], we are looking for other great people like you. Please share this with anyone that you think would like our product.",
						type:"textarea",
						placeholders: true,
						show:true,
						valid:true,
						required:true,
					}, {
						name:"incentiveChoice",
						displayName:"Would you like to include an incentive?",
						description:"",
						value:null,
						type:"select",
						options:[
							{
								name:"Yes",
								value:true
							},
							{
								name:"No",
								value:false
							}
						],
						show:true,
						required: true,
						valid: function () {
							return _.isBoolean(this.value);
						},
					}, {
						name:"incentiveText",
						displayName:"The Incentive",
						description:"A description of your incentive program",
						value:"",
						type:"textarea",
						depend:{
							name: "incentiveChoice",
							value: true,
						},
						placeholders: false,
						show:true,
						valid:true,
						required:false,
					}]
				}
			};
        }
	}	
	angular.module("lt.app").service("V2ReferralThreadCampaignForm", V2ReferralThreadCampaignForm);
}
