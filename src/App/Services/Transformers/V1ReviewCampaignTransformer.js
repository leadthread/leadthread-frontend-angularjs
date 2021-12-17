import { V1MessageThreadCampaignTransformer } from "./V1MessageThreadCampaignTransformer"

export class V1ReviewCampaignTransformer extends V1MessageThreadCampaignTransformer {}

export const module = {
	key: "V1ReviewCampaignTransformer",
	fn: V1ReviewCampaignTransformer,
}
