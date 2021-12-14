/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-03 09:32:58
*/
/// <reference path="V2TwoPassCampaignTransformer.ts" />
namespace lt {
    export class V2LeaderboardCampaignTransformer extends V2TwoPassCampaignTransformer {
        getIntroPageTitleIcon() {
            return "users";
        }

        /**
         * Overwrite
         */
        setSharePage(campaign: Campaign, form: CampaignForm) {
            // Do nothing
        }

        setShareSections(campaign: Campaign, form: CampaignForm, page: Page, order: number) {
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
                text: "Share Invite",
                text_align: "left",
                padding_vertical: 0,
                font_size: 24,
                icon: "share-alt",
            });

            // Instructions
            page.addSection({
                name: "share_description", type: "text"
            }, {
                order: order++,
                text: "To get started, input your friend's information below.",
                text_align: "left",
            });
            
            // Module
            page.addSection({
                name: "collect",
                type: "collect",
            }, {
                order: order++,
                text_align: "left",
            });
        }
    }

	angular.module("lt.app").service("V2LeaderboardCampaignTransformer", V2LeaderboardCampaignTransformer);
}
