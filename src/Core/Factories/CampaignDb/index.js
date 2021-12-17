import _ from "lodash"
import { Campaign } from "../../Classes"

export const key = "$campaignDb"

export const inject = ["$q", "$api", "CampaignFactory", "$auth"]

export const fn = ($q, $api, CampaignFactory, $auth) => {
	function load(id, type, version) {
		if (!type) {
			throw "A type must be set!"
		}

		if (_.isInteger(id)) {
			return $api
				.show("campaigns", id)
				.exec()
				.then(function (resp) {
					return CampaignFactory.create(resp.data).load(true)
				})
		} else {
			return CampaignFactory.create({
				company_id: this.$stateParams.companyId,
				content_sharing: true,
				incentive: null,
				incentive_id: null,
				is_phone_app: false,
				name: null,
				owner_id: $auth.getUserId(),
				target: null,
				type: type,
				brand: null,
				brand_id: null,
				version: version,
			}).load(true)
		}
	}

	function save(campaign) {
		if (campaign instanceof Campaign) {
			return campaign.save(true)
		} else {
			return $q.reject("Could not save campaign")
		}
	}

	function remove(campaign) {
		if (campaign instanceof Campaign) {
			return $q.when(campaign.destroy()).then(function () {
				return campaign
			})
		} else {
			return $q.reject("Could not delete campaign")
		}
	}

	return {
		load: load,
		save: save,
		remove: remove,
	}
}
