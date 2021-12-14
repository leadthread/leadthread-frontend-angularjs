/// <reference path="../prototypes/Factory.ts" />
namespace lt {
	export abstract class Model implements IModel {
		id?: number;
		created_at?: string;
		updated_at?: string;
		
		constructor(protected _service: ModelService, protected _data: IModel) {
			let key: string;
			this.set(_data);
		}

		load(include: string[]|boolean = null): ng.IPromise<this> {
			return this._service.load(this, include);
		}

		save(include: string[]|boolean = null): ng.IPromise<this> {
			return this._service.save(this, include);
		}

		destroy(): ng.IPromise<boolean> {
			return this._service.destroy(this.id);	
		}

		valueOf(): IModel {
			let x: _.Dictionary<any> = {};
			_.forEach(this.getAttributes(), (a) => {
				let y: _.Dictionary<any> = this;
				x[a] = y[a];
			});
			return x as IModel;
		}

		public abstract toString(): string;

		protected getAttributes(): string[] {
	        var properties: string[] = [];

            for (var propertyName in this) {
            	if(["number", "string", "boolean"].indexOf(typeof this[propertyName])>=0||propertyName.indexOf("_id")>=0) {
                	properties.push(propertyName);
            	}
			}
			
			_.pull(properties, "$$hashKey");
			
	        return properties;
	    }

	    protected set(_data: _.Dictionary<any>) {

	    	_data = _.merge(this.getDefaults(), _data);

	    	_.forIn(_data, (value, key) => {
	    		let self: _.Dictionary<any> = this;
	    		self[key] = value;
	    	});
	    }

	    protected getDefaults(): IModel {
	    	return _.cloneDeep({});
	    }
	}

	export abstract class ModelFactory extends Factory {
		static $inject = ["ModelService"];
		constructor(protected _service: ModelService) {
			super();
		}
		public create(_data: IModel): Model {
			return this._service.create(_data);
		}
	}

	export abstract class ModelService implements IModelService {
		protected resource: string;
		protected related: IModelServiceRelatedIndex;

		static $inject = ["$api", "$q"];
		constructor(protected $api: IApiService, protected $q: ng.IQService) {
			this.related = {
				load: {},
				save: {
					before: {},
					after: {},
				}
			}
		};

		/**
		 * Creates an instance of the Model but does not save it to the database
		 * @param  {IModel} _data [description]
		 * @return {Model}       [description]
		 */
		public create = (_data: IModel): Model => {
			throw "create() not implemented for "+this.resource;
		}

		protected beforeSave<T extends Model>(model: T): T {
			return model;
		}

		protected afterSave<T extends Model>(model: T): T {
			return model;
		}

		public save<T extends Model>(orig: T, include: string[]|boolean = null): ng.IPromise<T> {
			return this.saveRelatedBefore(orig, include).then(() => {
				orig = this.beforeSave(orig);

				if (!orig) {
					return this.$q.when(null);
				}

				if(_.isNumber(orig.id)) {
					return this.$api.update(this.resource, orig.valueOf()).exec<IApiItemResponse<T>>()
				} else {
					return this.$api.store(this.resource, orig.valueOf()).exec<IApiItemResponse<T>>()
				}
			})
			.then((fresh): T => {
				return _.merge(orig, fresh.data);
			})
			.then(this.afterSave)
			.then((fresh) => {
				return this.$q.when(this.saveRelatedAfter(fresh, include)).then(() => {
					return fresh
				});
			});
		}

		public saveFor<T extends Model>(parentResource: string, parentId: number, orig: T, include: string[]|boolean = false): ng.IPromise<T> {
			if(_.isNil(parentId)) {
				return this.$q.reject("ID for "+parentResource+" cannot be Nil when storing its related member: "+this.resource);
			}

			return this.saveRelatedBefore(orig, include).then(() => {
				orig = this.beforeSave(orig);
	
				if(_.isNumber(orig.id)) {
					return this.$api.show(parentResource, parentId)
						.update(this.resource, orig.valueOf())
						.exec<IApiItemResponse<T>>()
						.then(function (x) {return x.data;})
						.then(this.create);
				} else {
					return this.$api.show(parentResource, parentId)
						.store(this.resource, orig.valueOf())
						.exec<IApiItemResponse<T>>()
						.then(function (x) {return x.data;})
						.then(this.create);
				}
			})
			.then((fresh: IModel): T => {
				return _.merge(orig, fresh);
			})
			.then(this.afterSave)
			.then((fresh) => {
				return this.$q.when(this.saveRelatedAfter(fresh, include)).then(() => {
					return fresh
				});
			});
		}

		private saveRelated<T extends Model>(time: string, model: T, include: string[]|boolean = null): ng.IPromise<T[]> {
			let promises: {[key: string]: ng.IPromise<any>} = {},
				relatedSaveDict,
				x;

			if (time === "after") {
				x = this.related.save.after;
			} else {
				x = this.related.save.before;
			}

			relatedSaveDict = this.filterDictionaryKeys(x, include);

			_.forOwn(relatedSaveDict, (fn, prop: string) => {
				promises[prop] = fn(model, include);
			});

			return this.$q.all(promises);
		}

		protected saveRelatedAfter<T extends Model>(model: T, include: string[]|boolean = null): ng.IPromise<T[]> {
			return this.saveRelated("after", model, include)
		}

		protected saveRelatedBefore<T extends Model>(model: T, include: string[]|boolean = null): ng.IPromise<T[]> {
			return this.saveRelated("before", model, include)
		}

		public load = <T extends Model>(model: T, include: string[]|boolean = false): ng.IPromise<T> => {
			let promises: {[key: string]: ng.IPromise<any>} = {};
			let relatedLoadDict = this.filterDictionaryKeys(this.related.load, include);
			_.forOwn(relatedLoadDict, (fn, prop: string) => {
				promises[prop] = fn(model).then((x: Model|Model[]): ng.IPromise<Model|Model[]> => {
					if(_.isArray(x)) {
						let y = _.map(x, (i) => {
							return i.load(include);
						});
						return this.$q.all(y).then((a): Model[] => {
							return x;
						}); 
					} else {
						if (x instanceof Model) {
							return x.load(include);
						} else {
							return x;
						}
					}
				});
			});

			return this.$q.all(promises).then((x) => {
				return model;
			}, this.onApiError);
		}

		private onApiError = (e: string): ng.IPromise<never> => {
			console.error(e);
			return this.$q.reject(e);
		}

		public paginate(page: number = 1, limit: number = 24, params?: _.Dictionary<string|number>): ng.IPromise<IApiListResponse<Model>> {
			let x = this.$api.paginate(this.resource, page, limit, params).exec<IApiListResponse<Model>>();

			return x.then((r) => {
				if(_.isArray(r.data)) {
					r.data = _.map(r.data, this.create);
					return r as IApiListResponse<Model>;
				} else {
					return this.$q.reject("ModelService was expecting an array.");
				}
			});
		}

		public index(params?: _.Dictionary<string|number>): ng.IPromise<Model[]> {
			let x = this.$api.index(this.resource, params).exec<IApiListResponse<Model>>();
			return x.then((r) => {
				if(_.isArray(r.data)) {
					return _.map(r.data, this.create);
				} else {
					return this.$q.reject("ModelService was expecting an array.")
				}
			});
		}

		public indexFor(parentResource: string, parentId: number, params?: _.Dictionary<string|number>): ng.IPromise<Model[]> {
			if(_.isNil(parentId)) {
				return this.$q.reject("ID for "+parentResource+" cannot be Nil when loading its "+this.resource);
			}
			
			var x = this.$api.show(parentResource, parentId).index(this.resource, params).exec<IApiListResponse<Model>>();
			return x.then((r) => {
				if(_.isArray(r.data)) {
					return _.map(r.data, this.create);
				} else {
					return this.$q.reject("ModelService was expecting an array.")
				}
			});
		}

		public count(params?: _.Dictionary<string|number>): ng.IPromise<number> {
			return this.$api.count(this.resource, params).exec<IApiCountResponse>().then(function (x) {
				return x.data;
			});
		}

		public countFor(parentResource: string, parentId: number, params?: _.Dictionary<string|number>): ng.IPromise<number> {
			if(_.isNil(parentId)) {
				return this.$q.reject("ID for "+parentResource+" cannot be Nil when loading its "+this.resource);
			}
			return this.$api.show(parentResource, parentId).count(this.resource, params).exec<IApiCountResponse>().then(function (x) {
				return x.data;
			});
		}

		public showOrCreate(id: number, search: IModel): ng.IPromise<Model> {
			if(!id) {
				return this.$q.when(this.create(search));
			}
			return this.show(id).catch((error) => {
				return this.create(search);
			});
		}

		public show(id: number): ng.IPromise<Model> {
			if(_.isNil(id)) {
				return this.$q.reject("ID for "+this.resource+" is Nil");
			}

			let x = this.$api.show(this.resource, id).exec<IApiItemResponse<IModel>>();

			return x.then((y) => {
				return this.create(y.data);
			});
		}

		public destroy(id: number): ng.IPromise<boolean> {
			if(_.isNil(id)) {
				return this.$q.when(true);
			}

			let x = this.$api.destroy(this.resource, id).exec<IApiItemResponse<boolean>>().then(function (x) {
				return x.data;
			});

			return x;
		}

		public destroyFor(parentResource: string, parentId: number, id: number): ng.IPromise<boolean> {
			if(_.isNil(parentId)) {
				return this.$q.reject("ID for "+parentResource+" cannot be Nil when storing its related member: "+this.resource);
			}

			if(_.isNil(id)) {
				return this.$q.when(true);
			}

			let x = this.$api.show(parentResource, parentId).destroy(this.resource, id).exec<IApiItemResponse<boolean>>().then(function (x) {
				return x.data;
			});

			return x;
		}

		/**
		 * Filters a dictionary to include certain keys, all keys or no keys
		 * @param  {_.Dictionary<any>} dict    The dictionary to be filtered
		 * @param  {string[]|boolean}  include true: include all keys. false: include no keys. string[]: include only the keys in the array
		 * @return {_.Dictionary<any>}         Filtered dictionary
		 */
		private filterDictionaryKeys<T>(dict: _.Dictionary<T>, include: string[]|boolean): _.Dictionary<T> {
			if(_.isBoolean(include)){
				return include===true ? dict : {};
			} else if (_.isArray(include)) {
				return _.pick<_.Dictionary<T>, _.Dictionary<T>>(dict, include);
			} else {
				return {};
			}
		}

		protected assignResult = <T extends IModel>(model: Model, key: string, assignId: boolean = false): (x: T) => T => {
			return function(x) {
				let m: _.Dictionary<any> = model;
				m[key] = x;
				if(assignId) {
					if(_.isObject(x) && _.isNumber(x.id)) {
						m[key+"_id"] = x.id;
					} else {
						m[key+"_id"] = null;
					}
				}
				return x;
			}
		}
	}

	angular.module("lt.core").service("ModelService", ModelService); 
	angular.module("lt.core").service("ModelFactory", ModelFactory); 
}