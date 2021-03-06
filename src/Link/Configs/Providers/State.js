export const inject = ["$stateProvider"]

export const fn = ($stateProvider) => {
	$stateProvider.state("root", {
		url: "?{page:int}&{scrollTo}",
		template: require("../../Controllers/States/Root/index.html"),
		controller: "RootController",
		title: "Link",
		reloadOnSearch: false,
		resolve: {
			target: [
				"link",
				"$api",
				"CampaignService",
				"ActionPageService",
				function (link, $api, CampaignService, ActionPageService) {
					var x

					if (link.target_type === "App\\Models\\Campaign") {
						x = CampaignService.show(link.target_id).then(function (
							y
						) {
							return y.load(true)
						})
					} else {
						x = ActionPageService.show(link.target_id).then(
							function (y) {
								return y.load(true)
							}
						)
					}

					return x.then(function (data) {
						return data
					})
				},
			],
			link: [
				"LINK_ID",
				"$api",
				"$cacheFactory",
				function (LINK_ID, $api) {
					return $api
						.show("links", LINK_ID)
						.exec()
						.then(function (x) {
							return x.data
						})
				},
			],
			story: [
				"link",
				"StoryService",
				function (link, StoryService) {
					return link.story_id
						? StoryService.show(link.story_id)
						: null
				},
			],
			contact: [
				"link",
				"$api",
				"$state",
				function (link, $api) {
					if (!link.contact_id) {
						// if (link.type==="contact") {
						// 	return $state.go("root.auth.register", {linkId: link.id});
						// } else {
						return null
						// }
					} else {
						return $api
							.show("contacts", link.contact_id)
							.exec()
							.then(function (x) {
								return x.data
							})
					}
				},
			],
			owner: [
				"link",
				"$api",
				function (link, $api) {
					return $api
						.show("users", link.user_id)
						.exec()
						.then(function (x) {
							return x.data
						})
				},
			],
			company: [
				"link",
				"CompanyService",
				function (link, CompanyService) {
					return CompanyService.show(link.company_id)
				},
			],
			referral: [
				"link",
				"ReferralService",
				function (link, ReferralService) {
					if (link.referral_id) {
						return ReferralService.show(link.referral_id)
					} else {
						return null
					}
				},
			],
		},
	})
}
