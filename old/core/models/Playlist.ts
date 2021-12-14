/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:55:55
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Playlist extends Model implements IPlaylist {
		name: string;
		
		constructor(protected _service: PlaylistService, protected _data: IPlaylist) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}
	}

	export class PlaylistFactory extends ModelFactory {
		static $inject = ["PlaylistService"];
		constructor(protected _service: PlaylistService) {
			super(_service);
		}
		create(_data: IPlaylist): Playlist {
			return this._service.create(_data);
		}
	}

	export class PlaylistService extends ModelService {
		protected resource: string = "playlists";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: IPlaylist) => {
			return new Playlist(this, _data);
		}

		public show(id: number): ng.IPromise<Playlist> {
			return super.show(id);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Playlist[]> {
			return super.indexFor(parentResource, parentId);
		}
	}

	angular.module("lt.core").service("PlaylistService", PlaylistService); 
	angular.module("lt.core").service("PlaylistFactory", PlaylistFactory); 
}