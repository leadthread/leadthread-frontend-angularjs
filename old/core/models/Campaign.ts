/// <reference path="Thread.ts" />
namespace lt {
	export class Campaign extends Thread implements ICampaign {
		action_page: ActionPage;
		action_page_id: number;
		channel: string;
		company_id: number;
		contact_text_message: string;
		content_sharing: boolean;
		incentive: Incentive;
		incentive_id: number;
		is_phone_app: boolean;
		loaded: boolean;
		name: string;
		keyword: string;
		owner_id: number;
		referral_text_message: string;
		social_message: string;
		target: string;
		type: string;
		version: number;

		constructor(protected _service: CampaignService, protected _data: ICampaign) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}

		getDefaults(): ICampaign {
			return _.merge(super.getDefaults(), {
				company_id: null,
				content_sharing: true,
				incentive: null,
				incentive_id: null,
				is_phone_app: false,
				name: null,
				keyword: null,
				owner_id: null,
				target: null,
				type: null,
				brand: null,
				brand_id: null,
				version: null,
			});
		}
	}

	export class ReferralThreadCampaign extends Campaign {};
	export class LeaderboardCampaign extends Campaign {};
	export class MessageThreadCampaign extends Campaign {};
	export class TestimonialThreadCampaign extends Campaign {};
	export class ReachCampaign extends Campaign {};
	export class RecognitionCampaign extends Campaign {};
	export class ReviewCampaign extends Campaign {};

	export class CampaignFactory extends ThreadFactory {
		static $inject = ["CampaignService"];
		constructor(protected _service: CampaignService) {
			super(_service);
		}
		create(_data: ICampaign): Campaign {
			return this._service.create(_data);
		}
	}

	export class CampaignService extends ThreadService implements ICampaignService {
		protected resource: string = "campaigns";

		static $inject = ["$api", "$q", "SiteService", "BrandService", "ActionPageService", "IncentiveService", "APP_URL", "$stateParams"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected SiteService: SiteService, protected BrandService: BrandService, protected ActionPageService: ActionPageService, protected IncentiveService: IncentiveService, public APP_URL: string, public $stateParams: ng.ui.IStateParamsService) {
			super($api, $q, SiteService, BrandService);
			this.related.load.action_pages = this.loadActionPage;
			this.related.load.incentive = this.loadIncentive;
			this.related.save.before.action_pages = this.saveActionPage;
			this.related.save.before.incentive = this.saveIncentive;
		}

		public create = (_data: ICampaign): Campaign => {
			switch (_data.type) {
				case "referral-thread":
					return new ReferralThreadCampaign(this, _data);
				case "leaderboard":
					return new LeaderboardCampaign(this, _data);
				case "message-thread":
					return new MessageThreadCampaign(this, _data);
				case "reach":
					return new ReachCampaign(this, _data);
				case "recognition":
					return new RecognitionCampaign(this, _data);
				case "review":
					return new ReviewCampaign(this, _data);
				case "testimonial-thread":
					return new TestimonialThreadCampaign(this, _data);
				default:
					throw "Unknown type for Campaign: "+_.get(_data, "type", "null");
			}
		}

		public beforeSave(m: Campaign): Campaign {
			m.company_id = m.company_id || this.$stateParams.companyId;
			return m;
		}

		public showOrCreate(id: number, search: ICampaign): ng.IPromise<Campaign> {
			return super.showOrCreate(id, search);
		}

		public loadActionPage = (m: Campaign): ng.IPromise<ActionPage> => {
			return this.ActionPageService.showOrCreate(m.action_page_id, {name: m.type, type: m.type, company_id: m.company_id, brand: null, brand_id: null})
				.then(this.assignResult<ActionPage>(m, "action_page"));
		}

		public saveActionPage = (m: Campaign, include: string[]|boolean = false): ng.IPromise<ActionPage> => {
			return this.ActionPageService.save(m.action_page, include)
				.then(this.assignResult<ActionPage>(m, "action_page", true));
		}

		public saveIncentive = (m: Campaign, include: string[]|boolean = false): ng.IPromise<Incentive> => {
			if (m.incentive) {
				return this.IncentiveService.save(m.incentive, include)
					.then(this.assignResult<Incentive>(m, "incentive", true));
			} else {
				return this.$q.when(null);
			}
		}

		public loadIncentive = (m: Campaign): ng.IPromise<Incentive> => {
			if (m.type === "referral-thread" || m.type === "leaderboard" || m.type === "testimonial-thread") {
				return this.IncentiveService.showOrCreate(m.incentive_id, {text: null}).then(this.assignResult<Incentive>(m, "incentive"));
			} else {
				return this.$q.when(null);
			}
		}

		public show(id: number): ng.IPromise<Campaign> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}
	}

	angular.module("lt.core").service("CampaignService", CampaignService);
	angular.module("lt.core").service("CampaignFactory", CampaignFactory);
}