import { V2ReferralThreadCampaignForm } from "./V2ReferralThreadCampaignForm"

export class V2LeaderboardCampaignForm extends V2ReferralThreadCampaignForm {
	getType() {
		return "leaderboard"
	}
}

export const module = {
	key: "V2LeaderboardCampaignForm",
	fn: V2LeaderboardCampaignForm,
}
