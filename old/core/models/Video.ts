/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:52:14
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Video extends Model implements IVideo {
		constructor(protected _service: VideoService, protected _data: IVideo) {
			super(_service, _data);
		}

		toString(): string {
			return "Video #"+this.id;
		}
	}

	export class VideoFactory extends ModelFactory {
		static $inject = ["VideoService"];
		constructor(protected _service: VideoService) {
			super(_service);
		}
		create(_data: IVideo): Video {
			return this._service.create(_data);
		}
	}

	export class VideoService extends ModelService {
		protected resource: string = "videos";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: IVideo) => {
			return new Video(this, _data);
		}

		public show(id: number): ng.IPromise<Video> {
			return super.show(id);
		}

		public showOrCreate(id: number, search: IVideo): ng.IPromise<Video> {
			return super.showOrCreate(id, search);
		}

	}

	angular.module("lt.core").service("VideoService", VideoService); 
	angular.module("lt.core").service("VideoFactory", VideoFactory); 
}