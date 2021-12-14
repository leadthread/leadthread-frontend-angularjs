/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:55:55
*/
/// <reference path="Model.ts" />
namespace lt {
	export class PlaylistSchedule extends Model implements IPlaylistSchedule {
        name: string;
        playlist_id: number;
		
		constructor(protected _service: PlaylistScheduleService, protected _data: IPlaylistSchedule) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}
	}

	export class PlaylistScheduleFactory extends ModelFactory {
		static $inject = ["PlaylistScheduleService"];
		constructor(protected _service: PlaylistScheduleService) {
			super(_service);
		}
		create(_data: IPlaylistSchedule): PlaylistSchedule {
			return this._service.create(_data);
		}
	}

	export class PlaylistScheduleService extends ModelService {
		protected resource: string = "schedules";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: IPlaylistSchedule) => {
			return new PlaylistSchedule(this, _data);
		}

		public show(id: number): ng.IPromise<PlaylistSchedule> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<PlaylistSchedule[]> {
			return super.indexFor(parentResource, parentId);
		}
	}

	angular.module("lt.core").service("PlaylistScheduleService", PlaylistScheduleService); 
	angular.module("lt.core").service("PlaylistScheduleFactory", PlaylistScheduleFactory); 
}