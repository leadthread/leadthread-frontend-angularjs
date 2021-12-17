import { V1MessageThreadCampaignTransformer } from "./V1MessageThreadCampaignTransformer"

export class V1RecognitionCampaignTransformer extends V1MessageThreadCampaignTransformer {}

export const module = {
	key: "V1RecognitionCampaignTransformer",
	fn: V1RecognitionCampaignTransformer,
}
