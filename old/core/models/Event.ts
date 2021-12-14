/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-01 11:45:09
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Event extends Model implements IEvent {
		type: string;
		link_id: number;
		referral_id?: number;
		
		constructor(protected _service: EventService, protected _data: IEvent) {
			super(_service, _data);
		}

		toString(): string {
			return this.created_at + " Event #" + this.id + " | " + this.type;
		}
	}

	export class EventFactory extends ModelFactory {
		static $inject = ["EventService"];
		constructor(protected _service: EventService) {
			super(_service);
		}
		create(_data: IEvent): Event {
			return this._service.create(_data);
		}
	}

	export class EventService extends ModelService {
		protected resource: string = "events";
		public recorded: Event[] = [];
		
		static $inject = ["$api", "$q", "$http"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected $http: ng.IHttpService) {
			super($api, $q);
		}

		public record = (link: ILink, type: string, referral_id?: number) => {
			return this.create({
				link_id: link.id,
				type: type,
				referral_id: referral_id,
			}).save().then((e) => {
				this.recorded.push(e);
				return e;
			});
		}

		public create = (_data: IEvent) => {
			return new Event(this, _data);
		}

		public show(id: number): ng.IPromise<Event> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Event[]> {
			return super.indexFor(parentResource, parentId);
		}

		// public save<T extends Model>(orig: T, include: string[]|boolean = null): ng.IPromise<T> {
		// 	return this.saveRelatedBefore(orig, include).then(() => {
		// 		orig = this.beforeSave(orig);

		// 		if (!orig) {
		// 			return this.$q.when(null); 
		// 		}

		// 		if(_.isNumber(orig.id)) {
		// 			return this.$http.put<IApiItemResponse<T>>("/"+this.resource, orig.valueOf());
		// 		} else {
		// 			return this.$http.post<IApiItemResponse<T>>("/"+this.resource, orig.valueOf());
		// 		}
		// 	})
		// 	.then((fresh): T => {
		// 		return _.merge(orig, fresh.data);
		// 	})
		// 	.then(this.afterSave)
		// 	.then((fresh) => {
		// 		return this.$q.when(this.saveRelatedAfter(fresh, include)).then(() => {
		// 			return fresh
		// 		});
		// 	});
		// }
	}

	angular.module("lt.core").service("EventService", EventService); 
	angular.module("lt.core").service("EventFactory", EventFactory); 
}