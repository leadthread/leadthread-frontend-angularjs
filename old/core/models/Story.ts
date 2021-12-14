/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:52:52
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Story extends Model implements IStory {
		type: string;
		video: IVideo;
		image: IImage;
		caption: string;

		constructor(protected _service: StoryService, protected _data: IStory) {
			super(_service, _data);
		}

		toString(): string {
			return "Story #"+this.id+" "+this.type;
		}
	}

	export class StoryFactory extends ModelFactory {
		static $inject = ["StoryService"];
		constructor(protected _service: StoryService) {
			super(_service);
		}
		create(_data: IStory): Story {
			return this._service.create(_data);
		}
	}

	export class StoryService extends ModelService {
		protected resource: string = "stories";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}
		public create = (_data: IStory) => {
			return new Story(this, _data);
		}
	}

	angular.module("lt.core").service("StoryService", StoryService); 
	angular.module("lt.core").service("StoryFactory", StoryFactory); 
}