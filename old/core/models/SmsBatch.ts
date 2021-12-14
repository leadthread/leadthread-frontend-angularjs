/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-04 19:51:53
*/
/// <reference path="Model.ts" />
namespace lt {
	export class SmsBatch extends Model implements ISmsBatch {
        count: number;
		created_at: string;
		campaign_id: number;
		campaign: Campaign;
		
		constructor(protected _service: SmsBatchService, protected _data: ISmsBatch) {
			super(_service, _data);
		}

		toString(): string {
			return "Batch #"+this.id;
		}
	}

	export class SmsBatchFactory extends ModelFactory {
		static $inject = ["SmsBatchService"];
		constructor(protected _service: SmsBatchService) {
			super(_service);
		}
		create(_data: ISmsBatch): SmsBatch {
			return this._service.create(_data);
		}
	}

	export class SmsBatchService extends ModelService {
		protected resource: string = "batches";
		
		static $inject = ["$api", "$q", "CampaignService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected CampaignService: CampaignService) {
			super($api, $q);
			this.related.load.campaign = this.loadCampaign;
		}

		public create = (_data: ISmsBatch) => {
			return new SmsBatch(this, _data);
		}

		public loadCampaign = (m: SmsBatch): ng.IPromise<Campaign> => {
			return this.CampaignService.show(m.campaign_id)
				.then(this.assignResult<Campaign>(m, "campaign"));
		}
	}

	angular.module("lt.core").service("SmsBatchService", SmsBatchService); 
	angular.module("lt.core").service("SmsBatchFactory", SmsBatchFactory); 
}