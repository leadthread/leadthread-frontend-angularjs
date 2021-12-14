/// <reference path="Model.ts" />
namespace lt {
	export class Brand extends Model implements IBrand {
		name: string;
		logo_id: number;
		logo: File;
		favicon_id: number;
		favicon: File;
		domain: string;
		color: string;
		company_id: number;
		logo_background_color: string;
		homepage_url: string;
		
		constructor(protected _service: BrandService, protected _data: IBrand) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}
	}

	export class BrandFactory extends ModelFactory {
		static $inject = ["BrandService"];
		constructor(protected _service: BrandService) {
			super(_service);
		}
		create(_data: IBrand): Brand {
			return this._service.create(_data);
		}
	}

	export class BrandService extends ModelService {
		protected resource: string = "brands";
		
		static $inject = ["$api", "$q", "FileService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected FileService: FileService) {
			super($api, $q);
			this.related.load.logo = this.loadLogo;
			this.related.load.favicon = this.loadFavicon;
		}

		public create = (_data: IBrand) => {
			return new Brand(this, _data);
		}

		public show(id: number): ng.IPromise<Brand> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public loadLogo = (m: Brand): ng.IPromise<File> => {
			return this.FileService.show(m.logo_id)
				.then(this.assignResult<File>(m, "logo"))
				.catch(() => {
					return null;
				});
		}

		public loadFavicon = (m: Brand): ng.IPromise<File> => {
			return this.FileService.show(m.favicon_id)
				.then(this.assignResult<File>(m, "favicon"))
				.catch(() => {
					return null;
				});
		}

		public showOrCreate(id: number, search: IBrand): ng.IPromise<Brand> {
			return super.showOrCreate(id, search);
		}
	}

	angular.module("lt.core").service("BrandService", BrandService); 
	angular.module("lt.core").service("BrandFactory", BrandFactory); 
}