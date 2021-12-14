/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-06-21 11:22:49
*/
namespace lt {
	export class CampaignTransformerFactory implements IFactory {
		static $inject = [
			"V1MessageThreadCampaignTransformer",
			"V1ReferralThreadCampaignTransformer",
			"V1TestimonialThreadCampaignTransformer",
			"V2ReferralThreadCampaignTransformer",
			"V2TestimonialThreadCampaignTransformer",
			"V2LeaderboardCampaignTransformer",
			"V1ReachCampaignTransformer",
			"V1RecognitionCampaignTransformer",
			"V1ReviewCampaignTransformer",
		];
		
		constructor(
			protected V1MessageThreadCampaignTransformer: V1MessageThreadCampaignTransformer,
			protected V1ReferralThreadCampaignTransformer: V1ReferralThreadCampaignTransformer,
			protected V1TestimonialThreadCampaignTransformer: V1TestimonialThreadCampaignTransformer,
			protected V2ReferralThreadCampaignTransformer: V2ReferralThreadCampaignTransformer,
			protected V2TestimonialThreadCampaignTransformer: V2TestimonialThreadCampaignTransformer,
			protected V2LeaderboardCampaignTransformer: V2LeaderboardCampaignTransformer,
			protected V1ReachCampaignTransformer: V1ReachCampaignTransformer,
			protected V1RecognitionCampaignTransformer: V1RecognitionCampaignTransformer,
			protected V1ReviewCampaignTransformer: V1ReviewCampaignTransformer,
		) {

		}

		create(data: ICampaign): CampaignTransformer {
			let transformers: {[type: string]: {[version: number]: CampaignTransformer}} = {
				"message-thread": {
					1: this.V1MessageThreadCampaignTransformer,
				},	
				"reach": {
					1: this.V1ReachCampaignTransformer,
				},	
				"recognition": {
					1: this.V1RecognitionCampaignTransformer,
				},	
				"review": {
					1: this.V1ReviewCampaignTransformer,
				},	
				"referral-thread": {
					1: this.V1ReferralThreadCampaignTransformer,
					2: this.V2ReferralThreadCampaignTransformer,
				},	
				"leaderboard": {
					2: this.V2LeaderboardCampaignTransformer,
				},	
				"testimonial-thread": {
					1: this.V1TestimonialThreadCampaignTransformer,
					2: this.V2TestimonialThreadCampaignTransformer,
				},	
			}

			let transformer: CampaignTransformer = _.get(transformers, data.type+"."+data.version, null);
			
			if(transformer) {
				return transformer;
			}

			throw "Unknown type for CampaignTransformer: "+_.get(data, "type", "null")+" version "+_.get(data, "version", "null");
		}
	}

	angular.module("lt.app").service("CampaignTransformerFactory", CampaignTransformerFactory);
}
