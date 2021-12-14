import { V2TwoPassCampaignTransformer } from "./V2TwoPassCampaignTransformer"

export class V2TestimonialThreadCampaignTransformer extends V2TwoPassCampaignTransformer {
	getIntroPageTitleIcon() {
		return "smile-o"
	}

	setShareSections(campaign, form, page, order) {
		//** Share **
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
				text: "Get Started",
				text_align: "left",
				padding_vertical: 0,
				font_size: 24,
				icon: "lightbulb-o",
			}
		)

		// Module
		page.addSection(
			{
				name: "testimonial",
				type: "testimonial",
			},
			{
				order: order++,
				text_align: "left",
				padding_vertical: 14,
				padding_horizontal: 14,
			}
		)
	}
}
