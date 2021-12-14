/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
<<<<<<< HEAD
* @Last Modified time: 2017-07-19 13:55:50
=======
* @Last Modified time: 2017-06-21 11:23:55
>>>>>>> c52ee0acd38a541217d5351fe45a77f0a0f063de
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Referral extends Model implements IReferral {
		company?: string;
		email: string;
		first_name: string;
		last_name: string;
		phone: string|ITelephone;
		link?: ISmsHref;
		contact_id: number;
		is_lead: boolean;

		constructor(protected _service: ReferralService, protected _data: IReferral) {
			super(_service, _data);
		}

		toString(): string {
			return this.first_name + " " + this.last_name;
		}

		valueOf(): IReferral {
			return super.valueOf() as IReferral;
		}
	}

	export class ReferralFactory extends ModelFactory {
		static $inject = ["ReferralService"];
		constructor(protected _service: ReferralService) {
			super(_service);
		}
		create(_data: IReferral): Referral {
			return this._service.create(_data);
		}
	}

	export class ReferralService extends ModelService {
		protected resource: string = "referrals";
		
		static $inject = ["$api", "$q", "FileService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected FileService: FileService) {
			super($api, $q);
		}

		public create = (_data: IReferral) => {
			return new Referral(this, _data);
		}

		public show(id: number): ng.IPromise<Referral> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}
	}

	angular.module("lt.core").service("ReferralService", ReferralService); 
	angular.module("lt.core").service("ReferralFactory", ReferralFactory); 
}