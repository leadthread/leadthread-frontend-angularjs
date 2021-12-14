/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-02 09:44:35
*/
/// <reference path="V2ReferralThreadCampaignForm.ts" />
namespace lt {
	export class V2LeaderboardCampaignForm extends V2ReferralThreadCampaignForm {
		getType(): string {
			return "leaderboard"
		}
	}	
	angular.module("lt.app").service("V2LeaderboardCampaignForm", V2LeaderboardCampaignForm);
}
