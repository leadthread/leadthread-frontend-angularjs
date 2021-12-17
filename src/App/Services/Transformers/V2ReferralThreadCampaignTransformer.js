import { V2TwoPassCampaignTransformer } from "./V2TwoPassCampaignTransformer"

export class V2ReferralThreadCampaignTransformer extends V2TwoPassCampaignTransformer {
	getIntroPageTitleIcon() {
		return "users"
	}

	/**
	 * Overwrite
	 */
	setSharePage(campaign, form) {
		// Do nothing
	}

	setShareSections(campaign, form, page, order) {
		// Spacer
		page.addSection(
			{
				name: "share_spacer",
				type: "spacer",
			},
			{
				order: order++,
				font_color: "#DDDDDD",
			}
		)

		// Title
		page.addSection(
			{
				name: "share_title",
				type: "text",
			},
			{
				order: order++,
				text: "Share Invite",
				text_align: "left",
				padding_vertical: 0,
				font_size: 24,
				icon: "share-alt",
			}
		)

		// Instructions
		page.addSection(
			{
				name: "share_description",
				type: "text",
			},
			{
				order: order++,
				text: "We've made it easy, click a button below to share with your contacts.",
				text_align: "left",
			}
		)

		// Module
		page.addSection(
			{
				name: "share",
				type: "share",
			},
			{
				order: order++,
				text_align: "left",
			}
		)
	}
}

export const module = {
	key: "V2ReferralThreadCampaignTransformer",
	fn: V2ReferralThreadCampaignTransformer,
}
