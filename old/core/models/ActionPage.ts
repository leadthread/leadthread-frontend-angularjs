/// <reference path="Thread.ts" />
namespace lt {
	export class ActionPage extends Thread implements IActionPage {
		public company_id: number;
		public name: string;

		constructor(protected _service: ActionPageService, protected _data: IActionPage) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}
	}

	export class ActionPageFactory extends ThreadFactory {
		static $inject = ["ActionPageService"];
		constructor(protected _service: ActionPageService) {
			super(_service);
		}
		create(_data: IActionPage): ActionPage {
			return this._service.create(_data);
		}
	}

	export class ActionPageService extends ThreadService {
		protected resource: string = "action-pages";
		
		static $inject = ["$api", "$q", "SiteService", "BrandService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected SiteService: SiteService, protected BrandService: BrandService) {
			super($api, $q, SiteService, BrandService);
		}

		public create = (_data: IActionPage): ActionPage => {
			return new ActionPage(this, _data);
		}

		public show(id: number): ng.IPromise<ActionPage> {
			return super.show(id);
		}

		public showOrCreate(id: number, search: IActionPage): ng.IPromise<ActionPage> {
			return super.showOrCreate(id, search);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public saveFor(parentResource: string, parentId: number, model: ActionPage): ng.IPromise<ActionPage> {
			return super.saveFor(parentResource, parentId, model);
		}
	}

	angular.module("lt.core").service("ActionPageService", ActionPageService); 
	angular.module("lt.core").service("ActionPageFactory", ActionPageFactory); 
}