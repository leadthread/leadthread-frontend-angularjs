/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:51:06
*/
/// <reference path="Model.ts" />
namespace lt {
	export class User extends Model implements IUser {
		first_name: string;
		last_name: string;
		email: string;
		phone: string;
		company: string;
		
		constructor(protected _service: UserService, protected _data: IUser) {
			super(_service, _data);
		}

		toString(): string {
			return this.first_name + " " + this.last_name;
		}
	}

	export class UserFactory extends ModelFactory {
		static $inject = ["UserService"];
		constructor(protected _service: UserService) {
			super(_service);
		}
		create(_data: IUser): User {
			return this._service.create(_data);
		}
	}

	export class UserService extends ModelService {
		protected resource: string = "users";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: IUser) => {
			return new User(this, _data);
		}

		public show(id: number): ng.IPromise<User> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<User[]> {
			return super.indexFor(parentResource, parentId);
		}
	}

	angular.module("lt.core").service("UserService", UserService); 
	angular.module("lt.core").service("UserFactory", UserFactory); 
}