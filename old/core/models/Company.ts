/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:58:13
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Company extends Model implements ICompany {
		name: string;
		brand: Brand;
		brand_id: number;
		disabled_at: string;
		
		constructor(protected _service: CompanyService, protected _data: ICompany) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}
	}

	export class CompanyFactory extends ModelFactory {
		static $inject = ["CompanyService"];
		constructor(protected _service: CompanyService) {
			super(_service);
		}
		create(_data: ICompany): Company {
			return this._service.create(_data);
		}
	}

	export class CompanyService extends ModelService {
		protected resource: string = "companies";
		
		static $inject = ["$api", "$q", "BrandService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected BrandService: BrandService) {
			super($api, $q);
			this.related.load.brand = this.loadBrand;
		}

		public create = (_data: ICompany) => {
			return new Company(this, _data);
		}

		public show(id: number): ng.IPromise<Company> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public paginate(page: number = 1, limit: number = 24, params?: _.Dictionary<string|number>): ng.IPromise<IApiListResponse<Company>> {
			return super.paginate(page, limit, params);
		}
			
		public index(params?: _.Dictionary<string|number>): ng.IPromise<Company[]> {
			return super.index(params);
		}

		public indexFor(parentResource: string, parentId: number, params?: _.Dictionary<string|number>): ng.IPromise<Company[]> {
			return super.indexFor(parentResource, parentId, params);
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
	}

	angular.module("lt.core").service("CompanyService", CompanyService); 
	angular.module("lt.core").service("CompanyFactory", CompanyFactory); 
}