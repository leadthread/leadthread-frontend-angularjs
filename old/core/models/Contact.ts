/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:58:03
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Contact extends Model implements IContact {
		company?: string;
		email: string;
		first_name: string;
		last_name: string;
		phone: string;
		link?: ISmsHref;
		points: Point[];

		constructor(protected _service: ContactService, protected _data: IContact) {
			super(_service, _data);
		}

		toString(): string {
			return this.first_name + " " + this.last_name;
		}

		valueOf(): IContact {
			return super.valueOf() as IContact;
		}

		protected getAttributes(): string[] {
	        let properties: string[] = super.getAttributes();
			_.pull(properties, "sent");
			_.pull(properties, "selected");
	        return properties;
	    }
	}

	export class ContactFactory extends ModelFactory {
		static $inject = ["ContactService"];
		constructor(protected _service: ContactService) {
			super(_service);
		}
		create(_data: IContact): Contact {
			return this._service.create(_data);
		}
	}

	export class ContactService extends ModelService {
		protected resource: string = "contacts";
		
		static $inject = ["$api", "$q", "FileService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected FileService: FileService) {
			super($api, $q);
		}

		public create = (_data: IContact) => {
			return new Contact(this, _data);
		}

		public show(id: number): ng.IPromise<Contact> {
			return super.show(id);
		}

		public index(params?: _.Dictionary<string|number>): ng.IPromise<Contact[]> {
			return super.index(params);
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Contact[]> {
			return super.indexFor(parentResource, parentId);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}
	}

	angular.module("lt.core").service("ContactService", ContactService); 
	angular.module("lt.core").service("ContactFactory", ContactFactory); 
}