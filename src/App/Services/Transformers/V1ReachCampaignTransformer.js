import { V1MessageThreadCampaignTransformer } from "./V1MessageThreadCampaignTransformer"

export class V1ReachCampaignTransformer extends V1MessageThreadCampaignTransformer {}

export const module = {
	key: "V1ReachCampaignTransformer",
	fn: V1ReachCampaignTransformer,
}
