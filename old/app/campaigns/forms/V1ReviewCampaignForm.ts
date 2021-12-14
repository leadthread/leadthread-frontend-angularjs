/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-02 09:44:32
*/
namespace lt {
	export class V1ReviewCampaignForm extends V1MessageThreadCampaignForm {
		constructor(protected service: CampaignFormService, protected data: ICampaignForm) {
			super(service, data);
			this.type = "review";
			this.version = 1;
		}
	}	
	angular.module("lt.app").service("V1ReviewCampaignForm", V1ReviewCampaignForm);
}
