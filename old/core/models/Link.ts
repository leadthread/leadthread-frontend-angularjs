/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 20:45:55
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Link extends Model implements ILink {
		contact_id: number;
		long_url: string;
		sent_via: string;
		short_url: string;
		target_id: number;
		target_type: string;
		
		constructor(protected _service: LinkService, protected _data: ILink) {
			super(_service, _data);
		}

		toString(): string {
			return this.long_url;
		}
	}

	export class LinkFactory extends ModelFactory {
		static $inject = ["LinkService"];
		constructor(protected _service: LinkService) {
			super(_service);
		}
		create(_data: ILink): Link {
			return this._service.create(_data);
		}
	}

	export class LinkService extends ModelService {
		protected resource: string = "links";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: ILink) => {
			return new Link(this, _data);
		}

		public show(id: number): ng.IPromise<Link> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}
	}

	angular.module("lt.core").service("LinkService", LinkService); 
	angular.module("lt.core").service("LinkFactory", LinkFactory); 
}