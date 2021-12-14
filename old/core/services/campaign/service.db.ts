/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-10 15:49:07
*/
namespace lt.services {
	angular.module("lt.core").factory("$campaignDb", ["$q", "$api", "CampaignFactory", "$auth", function ($q: ng.IQService, $api: IApiService, CampaignFactory: CampaignFactory, $auth: IAuthService) {

		function load (id: number, type: string, version: number): ng.IPromise<Campaign> {
			if (!type) {
				throw "A type must be set!";
			}

			if (_.isInteger(id)) {
				return $api.show("campaigns", id).exec<IApiItemResponse<ICampaign>>().then(function (resp) {
					return (CampaignFactory.create(resp.data)).load(true);
				});
			} else {
				return (CampaignFactory.create({
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
				})).load(true);
			}
		}

		function save (campaign: Campaign): ng.IPromise<Campaign> {
			if (campaign instanceof Campaign) {
				return campaign.save(true);
			} else {
				return $q.reject("Could not save campaign");
			}
		}

		function remove (campaign: Campaign): ng.IPromise<Campaign>  {
			if (campaign instanceof Campaign) {
				return $q.when(campaign.destroy()).then(function() {
					return campaign;
				});
			} else {
				return $q.reject("Could not delete campaign");
			}
		}

		return {
			load: load,
			save: save,
			remove: remove
		};
	}]);
}