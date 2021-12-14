/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-03 09:32:58
*/
/// <reference path="V2TwoPassCampaignTransformer.ts" />
namespace lt {
    export class V2TestimonialThreadCampaignTransformer extends V2TwoPassCampaignTransformer {
        getIntroPageTitleIcon() {
            return "smile-o";
        }

        setShareSections(campaign: Campaign, form: CampaignForm, page: Page, order: number) {
            //** Share **
            // Spacer
            page.addSection({
                name: "share_spacer",
                type: "spacer",
            }, {
                order: order++,
                font_color: "#DDDDDD",
            });

            // Title
            page.addSection({
                name: "share_title", type: "text"
            }, {
                order: order++,
                text: "Get Started",
                text_align: "left",
                padding_vertical: 0,
                font_size: 24,
                icon: "lightbulb-o",
            });
            
            // Module
            page.addSection({
                name: "testimonial",
                type: "testimonial",
            }, {
                order: order++,
                text_align: "left",
                padding_vertical: 14,
                padding_horizontal: 14,
            });
        }
    }

	angular.module("lt.app").service("V2TestimonialThreadCampaignTransformer", V2TestimonialThreadCampaignTransformer);
}
