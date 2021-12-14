/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:58:03
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Point extends Model implements IPoint {
        type: string;
        contact_id: number;
        sms_batch_id: number;

		constructor(protected _service: PointService, protected _data: IPoint) {
			super(_service, _data);
        }
        
        toString(): string {
			return "Point #"+this.id;
		}

		valueOf(): IPoint {
			return super.valueOf() as IPoint;
		}
	}

	export class PointFactory extends ModelFactory {
		static $inject = ["PointService"];
		constructor(protected _service: PointService) {
			super(_service);
		}
		create(_data: IPoint): Point {
			return this._service.create(_data);
		}
	}

	export class PointService extends ModelService {
		protected resource: string = "points";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: IPoint) => {
			return new Point(this, _data);
		}

		public show(id: number): ng.IPromise<Point> {
			return super.show(id);
		}

		public index(params?: _.Dictionary<string|number>): ng.IPromise<Point[]> {
			return super.index(params);
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Point[]> {
			return super.indexFor(parentResource, parentId);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}
	}

	angular.module("lt.core").service("PointService", PointService); 
	angular.module("lt.core").service("PointFactory", PointFactory); 
}