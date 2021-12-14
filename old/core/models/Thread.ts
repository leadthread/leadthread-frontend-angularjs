/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-14 14:31:52
*/
/// <reference path="Model.ts" />
namespace lt {
	export abstract class Thread extends Model implements IThread {
		company_id: number;
		name: string;
		site: Site;
		site_id: number;
		type: string;
		brand: Brand;
		brand_id: number;
		
		constructor(protected _service: ThreadService, protected _data: IThread) {
			super(_service, _data);
		}
	}

	export abstract class ThreadFactory extends ModelFactory {
		static $inject = ["ThreadService"];
		constructor(protected _service: ThreadService) {
			super(_service);
		}
		create(_data: IThread) {
			return this._service.create(_data);
		}
	}

	export abstract class ThreadService extends ModelService {
		protected resource: string = null;
		
		static $inject = ["$api", "$q", "SiteService", "BrandService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected SiteService: SiteService, protected BrandService: BrandService) {
			super($api, $q);
			this.related.load.brand = this.loadBrand;
			this.related.load.site = this.loadSite;
			this.related.save.before.brand = this.saveBrand;
			this.related.save.before.site = this.saveSite;
		}

		public loadBrand = (m: Thread): ng.IPromise<Brand> => {
			return this.BrandService.showOrCreate(m.brand_id, {
				name: null,
				logo_id: null,
				logo: null,
				favicon_id: null,
				favicon: null,
				domain: null,
				color: "#666666",
				company_id: m.company_id,
				logo_background_color: "#FFFFFF",
				homepage_url: null,
			})
				.then(this.assignResult<Brand>(m, "brand"))
				.catch(() => {
					return null;
				});
		}

		public loadSite = (m: Thread): ng.IPromise<Site> => {
			let type;
			if (m instanceof ActionPage) {
				type = "action";
			} else {
				type = m.type;
			}

			return this.SiteService.showOrCreate(m.site_id, {type: type, name: type, company_id: m.company_id, pages: []})
				.then(this.assignResult<Site>(m, "site"));
		}

		public saveSite = (m: Thread, include: string[]|boolean = false): ng.IPromise<Site> => {
			return m.site.save(include)
				.then(this.assignResult<Site>(m, "site", true));
		}

		public saveBrand = (m: Thread, include: string[]|boolean = false): ng.IPromise<Brand> => {
			return m.brand.save(include)
				.then(this.assignResult<Brand>(m, "brand", true));
		}
	}

	angular.module("lt.core").service("ThreadService", ThreadService); 
	angular.module("lt.core").service("ThreadFactory", ThreadFactory); 
}