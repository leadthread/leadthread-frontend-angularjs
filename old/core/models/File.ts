/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:57:32
*/
/// <reference path="Model.ts" />
namespace lt {
	export class File extends Model implements IFile {
		fingerprint: string;
		mime: string;
		
		constructor(protected _service: FileService, protected _data: IFile) {
			super(_service, _data);
		}

		toString(): string {
			return this.getUrl();
		}

		getUrl(): string {
			if (_.isString(this.fingerprint) && this.fingerprint.length > 0) {
				return "/files/" + this.fingerprint + "/thumb/480";
			}
			return null;
		}
	}

	export class Image extends File implements IImage {}
	export class Document extends File implements IDocument {}

	export class FileFactory extends ModelFactory {
		static $inject = ["FileService"];
		constructor(protected _service: FileService) {
			super(_service);
		}
		create(_data: IFile): File {
			return this._service.create(_data);
		}
	}

	export class FileService extends ModelService {
		protected resource: string = "files";
		
		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			super($api, $q);
		}

		public create = (_data: IFile) => {
			return new File(this, _data);
		}

		public show(id: number): ng.IPromise<File> {
			return super.show(id);
		}

		public showOrCreate(id: number, search: IFile): ng.IPromise<File> {
			return super.showOrCreate(id, search);
		}

	}

	angular.module("lt.core").service("FileService", FileService); 
	angular.module("lt.core").service("FileFactory", FileFactory); 
}