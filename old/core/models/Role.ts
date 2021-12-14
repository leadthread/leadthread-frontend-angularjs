/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-04 19:51:53
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Role extends Model implements IRole {
		name: string;
		
		constructor(protected _service: RoleService, protected _data: IRole) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}
	}

	export class RoleFactory extends ModelFactory {
		static $inject = ["RoleService"];
		constructor(protected _service: RoleService) {
			super(_service);
		}
		create(_data: IRole): Role {
			return this._service.create(_data);
		}
	}

	export class RoleService extends ModelService {
		protected resource: string = "roles";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}
		public create = (_data: IRole) => {
			return new Role(this, _data);
		}
	}

	angular.module("lt.core").service("RoleService", RoleService); 
	angular.module("lt.core").service("RoleFactory", RoleFactory); 
}