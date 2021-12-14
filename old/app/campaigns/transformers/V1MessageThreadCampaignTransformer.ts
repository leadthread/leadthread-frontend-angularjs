/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-18 11:09:52
*/
/// <reference path="CampaignTransformer.ts" />
namespace lt {
	export class V1MessageThreadCampaignTransformer extends CampaignTransformer {

		toCampaign(form: CampaignForm): ng.IPromise<Campaign> {
			return this.createCampaignInstance(form).then((campaign) => {

				campaign.is_phone_app = false;
				campaign.contact_text_message = form.getField("uPMessage").value;		// SMS To Contact [string]
				campaign.name = form.getField("campaignName").value;
				campaign.keyword = form.getField("campaignKeyword").value;
				campaign.channel = null;
				campaign.content_sharing = false; // Should Site Allow Testimonials [boolean]

				var promise = [];
				promise.push(this.$q.when(this.setBrand(campaign, form)));
				promise.push(this.$q.when(this.setActionPage(campaign, form)));

				return this.$q.all(promise).then(() => {
					this.campaign = campaign;
					return campaign;
				});
			});
		}

		toForm(campaign: Campaign): CampaignForm {
			var form = this.createFormInstance(campaign);
			
			this.setNameFormField(form, campaign);
			this.setKeywordFormField(form, campaign);
			this.setBrandingFormFields(form, campaign);
			this.setUserContactMessageFormField(form, campaign);
			
			this.setActionPageFormFields(form, campaign);
			return form;
		}
	}

	angular.module("lt.app").service("V1MessageThreadCampaignTransformer", V1MessageThreadCampaignTransformer);
}