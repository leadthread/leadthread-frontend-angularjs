/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:57:16
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Incentive extends Model implements IIncentive {
		text: string;
		media?: IImage|IVideo|IFile;
		media_id?: number;
		media_type?: string;
		
		constructor(protected _service: IncentiveService, protected _data: IIncentive) {
			super(_service, _data);
		}

		toString(): string {
			return "Incentive #"+this.id;
		}

		isEmpty(): boolean {
			return !_.isString(this.text) && !_.isObject(this.media);
		}
	}

	export class IncentiveFactory extends ModelFactory {
		static $inject = ["IncentiveService"];
		constructor(protected _service: IncentiveService) {
			super(_service);
		}
		create(_data: IIncentive): Incentive {
			return this._service.create(_data);
		}
	}

	export class IncentiveService extends ModelService {
		protected resource: string = "incentives";
		
		static $inject = ["$api", "$q", "FileService", "VideoService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected FileService: FileService, protected VideoService: VideoService) {
			super($api, $q);
			this.related.load.media = this.loadMedia;
		}
		public create = (_data: IIncentive) => {
			return new Incentive(this, _data);
		}
		public showOrCreate(id: number, search: IIncentive): ng.IPromise<Incentive> {
			return super.showOrCreate(id, search);
		}
		public loadMedia = (m: Incentive): ng.IPromise<File|Video> => {
			if (!m.media_id) {
				return this.$q.when(null);
			}
			let x: ng.IPromise<File|Video>;
			if (m.media_type === "App\\Models\\File")
				x = this.FileService.show(m.media_id);
			else
				x = this.VideoService.show(m.media_id);
			return x.then((media) => {
				return media;
			}).then(this.assignResult<File|Video>(m, "media", true));
		}
	}

	angular.module("lt.core").service("IncentiveService", IncentiveService); 
	angular.module("lt.core").service("IncentiveFactory", IncentiveFactory); 
}