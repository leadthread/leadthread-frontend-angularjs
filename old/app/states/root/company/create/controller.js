(function (angular, _) {
	"use strict";
	
	angular.module("lt.app").controller("CreateController", ["$scope", "$state", "$campaignDb", "$popup", "$api", "$http", "$transitions", "CampaignService", "$notification", "companies", "company", function ($scope, $state, $campaignDb, $popup, $api, $http, $transitions, CampaignService, $notification, companies, company) {

		/**
		 * Start it up
		 */
		function init () {
			return refresh().then(function () {
				defineScope();
				defineListeners();
			});
		}

		function refresh() {
			return loadCampaigns().then(function (campaigns) {
				$scope.campaigns = campaigns;
				return campaigns;
			});
		}

		function defineScope () {
			$scope.deleteCampaign = deleteCampaign;
			$scope.copyCampaign = copyCampaign;
			$scope.getCampaigns = getCampaigns;
			$scope.campaignsLength = campaignsLength;
			$scope.selectedCampaign = {"var": {}};
			$scope.openTypeInfoModal = openTypeInfoModal;
			$scope.types = [
				{
					name: "ReferralThread",
					key: "referral-thread",
					icon: "icon-handshake-o",
					enabled: company.module_referral,
					description: "The simplest way for your customers, colleagues, and partners to introduce you to their personal contacts by sharing (via SMS or social media) an Action page that promotes your product/service and makes it easy for referrals to contact you.",
				}, 
				{
					name: "Leaderboard",
					key: "leaderboard",
					icon: "icon-trophy",
					enabled: company.module_leaderboard,
					description: "Use Leaderboard - when you want to run a \"Live\" or \"Real-time\" referral campaign, that can be viewed during a group referral session. A Leaderboard campaign will show the names of all participants in the campaign and display real- time results as they come in. Leaderboard is ideal for both Employee Referrals and Product Referrals, that are conducted in a group setting. \n\nIdeal for: New Hire groups, Team Meetings, Seminars, etc.."
				},
				{
					name: "MessageThread",
					key: "message-thread",
					icon: "icon-share",
					enabled: company.module_message,
					description: "Need to share important information and set a clear call-to-action? MessageThread delivers your most updated  marketing information, follow up messages, and important updates directly to your target audience via SMS with actionable next steps.",
				}, 
				{
					name: "TestimonialThread",
					key: "testimonial-thread",
					icon: "icon-comment-video-o",
					enabled: company.module_testimonial,
					description: "Customers are invited to share their buying experience via video or written testimonials and share it with all their friends on social media or directly via SMS to expand your reach and warm up potential opportunities.",
				}, 
				{
					name: "Recognition",
					key: "recognition",
					icon: "icon-heart",
					enabled: company.module_recognition,
					description: "For sending out quick messages and videos to recognize your employees and keep them engaged about things like: Benefits, Company Party, Career Opportunities, Thanks, Awards, etc.",
				},
				{
					name: "Reach",
					key: "reach",
					icon: "icon-bullhorn",
					enabled: company.module_reach,
					description: "For sending strategic, text based messages with quick 1-2 minute videos directly to employees for: Best	practices, Motivational, Revenue Drivers, Strategic Information for adapting and winning.",
				},
				{
					name: "Review",
					key: "review",
					icon: "icon-comment",
					enabled: company.module_reviews,
					description: "For sending a pre-loaded text message campaigns to employees – who you know will increase your online scores for Glassdoor, Indeed, etc.",
				},
			];
			$scope.removing = false;
			$scope.getCampaignIcon = getCampaignIcon;
			$scope.isTypeDisabled = isTypeDisabled;

			compileCampaignList();
		}

		function compileCampaignList()
		{
			_.forEach($scope.types, function (type) {
				type.campaigns = getCampaigns(type.key);
			});
		}

		function campaignsLength (campaigns, type) {
			var res = [];
			res = _.filter(campaigns, function (o) {
				return o.type == type;
			});
			return res.length;
		}

		function isTypeDisabled (type) {
			if (!type.disabled) {
				$state.go("root.company.create.new", {campaignType:type.key});
			}
		}

		function defineListeners () {
			$scope.$watch(function () {
				return _.get($scope, "selectedCampaign.var.id", null);
			}, function (n, o) {
				var campaign = _.get($scope, "selectedCampaign.var", {});
				if (n != o && campaign.id && campaign.type) {
					$scope.selectedCampaign = null;
					$state.go("root.company.create.edit", {campaignType: campaign.type, campaignId: campaign.id});
				}
			});
		}

		/**
		 * Gets all campaigns of a certian type
		 * @param  {String} type Representation of campaign type
		 * @return {Array}       Arrray of referral campaigns
		 */
		function getCampaigns (type) {
			if (!type) {
				return $scope.campaigns;
			} else {
				return _.filter($scope.campaigns, {type: type});
			}
		}

		function openTypeInfoModal (type) {
			$popup.info(type.name, type.description);
		}

		function getCampaignIcon (type) {
			var obj = _.first(_.filter($scope.types, {key: type}));
			return obj ? obj.icon : "";
		}

		function loadCampaigns () {
			var x = CampaignService.index();
			return x;
		}

		function copyCampaign (campaign) {
			$popup.copy(campaign, _.filter(companies, function (company) {
				return company.status !== "disabled";
			}), company).then(function (options) {
				return $http.post("/api/v1/campaigns/"+campaign.id+"/copy", {
					name: options.name,
					company_id: options.target.id,
				}).then(function (result) {
					
					var campaign = CampaignService.create(result.data.data);
					
					if (campaign.company_id === company.id) {
						$scope.campaigns.push(campaign);
						compileCampaignList();
					}

					$notification.success("Campaign was copied!");
				});
			})
		}

		function deleteCampaign (campaign) {
			if (confirm("Are you sure you want to delete this Campaign?")) {
				return CampaignService.destroy(campaign.id).then(() => {
					$notification.success("Campaign has been deleted.");
					_.remove($scope.campaigns, {id: campaign.id});
					compileCampaignList();
				});
			}
		}

		init();
	}]);
})(window.angular, window._);