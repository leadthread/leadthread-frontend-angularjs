/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-02 10:05:23
*/
/// <reference path="V2TwoPassCampaignForm.ts" />
namespace lt {
	export class V2TestimonialThreadCampaignForm extends V2TwoPassCampaignForm {
		getType(): string {
			return "testimonial-thread"
		}

		getVersion(): number {
			return 2;
		}

		getStepTwo(self: CampaignForm): ICampaignFormGroup {
            return <ICampaignFormGroup>{
				"Testimonial Page": <ICampaignFormSubGroup>{
					questions: [{
						name:"descriptionTitle",
						displayName:"Introduction Title",
						description:"An introduction to the person that will share the Action Page.",
						value:"Share Your Experience",
						type:"text",
						placeholders: false,
						show:true,
						valid:true,
						required:true,
					}, {
						name:"descriptionBody",
						displayName:"Introduction Body",
						description:"",
						value:"The best compliment you can give is a referral and we’ve made it easy to share your buying experience with your contacts.\n\nThanks for spreading the word!",
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
	angular.module("lt.app").service("V2TestimonialThreadCampaignForm", V2TestimonialThreadCampaignForm);
}
