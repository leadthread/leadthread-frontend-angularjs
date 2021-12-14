namespace lt.services {
	
	class RunningRequests {
		private static _requests: _.Dictionary<ng.IPromise<any>> = {};
		static get<T>(key: string): ng.IPromise<T> {
			return RunningRequests._requests[key];
		}

		static set<T>(key: string, value: ng.IPromise<T>) {
			RunningRequests._requests[key] = value;
		}

		static remove(key: string) {
			delete RunningRequests._requests[key];
		}
	}
	
	export class Request {
		protected _includeDeleted: boolean = false;
		protected _root: string = "api/v1";

		protected _method: string[] = [];
		protected _path: string[] = [];
		protected _resource: string[] = [];
		protected _resource_id: string[] = [];
		protected _action: string[] = [];
		protected _params: _.Dictionary<any> = {};

		constructor(private $http: ng.IHttpService, private $httpParamSerializer: ng.IHttpParamSerializer, private $httpPreload: ng.ICacheObject) {}

		set includeDeleted(x: boolean) {
			this._includeDeleted = x;
		}

		set path(x: string) {
			if(x) {
				this._path.push(x);
			}
		}
		get path(): string {
			return "/" + [this._root].concat(this._path).join("/");
		}

		set method(x: string) {
			this._method.push(x);
		}
		get method(): string {
			return _.last(this._method);
		}

		set action(x: string) {
			this._action.push(x);
		}
		get action(): string {
			return _.last(this._action);
		}

		set resource(x: string) {
			this._resource.push(x);
		}
		get resource(): string {
			return _.last(this._resource);
		}

		set resource_id(x: string) {
			if(x) {
				this._resource_id.push(x);
			}
		}
		get resource_id(): string {
			if (this._resource_id.length === this._resource.length) {
				return _.last(this._resource_id);
			}
			return;
		}

		set params(x: _.Dictionary<any>) {
			if(_.isPlainObject(x)) {
				this._params = _.merge(this._params, x);
			}
		}
		get params(): _.Dictionary<any> {
			return this._params;
		}

		add(action: string, resource: string, resource_id: string = null, params: _.Dictionary<any>|IModel = null) {
			this.action = action;
			this.method = this.getMethodForAction(action);
			this.resource = resource;
			this.resource_id = resource_id;
			this.params = params;
			this.path = resource;
			this.path = resource_id;
		}

		/**
		 * Checks for any pre-existing api requests and returns the duplicate or a new request
		 */
		public exec(canceler: ng.IDeferred<any> = null): ng.IPromise<IApiResponse> {
			let config = this.buildHttpRequestConfig(canceler);

			if (this.method !== "GET") {
				let promise = this.$http(config).then((x) => {
					return x.data;
				});

				if (_.includes(["DELETE", "POST", "PUT"], this.method)) {
					promise.then((x) => {
						this.$httpPreload.removeAll();
						return x;
					});
				}

				return promise;
			}

			// Process GET requests and check for duplicates
			let key = this.toString();
			let request = RunningRequests.get<IApiResponse>(key);

			if (!(request && !config.timeout)) {
				// Create a new http request
				request = this.$http(config).then((x) => {
					RunningRequests.remove(key);
					return x.data;
				});

				if (!config.timeout) {
					RunningRequests.set(key, request);
				}
			}

			return request;
		};

		/**
		 * Makes an HTTP request
		 */
		protected buildHttpRequestConfig(canceler: ng.IDeferred<any> = null) {
			let request: ng.IRequestConfig = {
				method: this.method, 
				url: this.path,
				cache: this.$httpPreload,
			};

			if (request.method == "GET") {
				if (this._includeDeleted) {
					this.params = {"_deleted": true};
				}
				request.params = this.params;
			} else {
				request.data = this.params;
			}

			if (canceler) {
				request.timeout = canceler.promise;
			}

			return request;
		};

		protected getMethodForAction(action: string) {
			switch(action) {
				case "index":
				case "show":
				case "count":
				case "paginate":
					return "GET";
				case "store":
					return "POST";
				case "update":
					return "PUT";
				case "destroy":
					return "DELETE";
				default:
					throw "Unknown action: "+action;
			}
		}

		toString(): string {
			let params = this.$httpParamSerializer(this.params);
			return this.path + (params === "" ? "" : "?"+params);
		}
	}

	export class ApiService implements IApiService {
		static existing: ng.IPromise<any>[] = [];

		protected _request: Request = null;

		static $inject = ["$http", "$httpParamSerializer", "$httpPreload"];
		constructor(protected $http: ng.IHttpService, protected $httpParamSerializer: ng.IHttpParamSerializer, protected $httpPreload: ng.ICacheObject) {}

		get request(): Request {
			this._request = this._request ? this._request : new Request(this.$http, this.$httpParamSerializer, this.$httpPreload);
			return this._request;
		}

		index = (resource: string, params: _.Dictionary<any> = {}): this => {
			this.request.add("index", resource, null, params);
			return this;
		}
		paginate = (resource: string, page: number = 1, limit: number = 24, params: _.Dictionary<any> = {}): this => {
            params = !params ? {} : params;
			params.page = page;
			params.limit = limit;
			this.request.add("paginate", resource, null, params);
			return this;
		}
		count = (resource: string, params: _.Dictionary<any> = {}): this => {
			this.request.add("count", resource, "count", params);
			return this;
		}
		show = (resource: string, id: number, params: _.Dictionary<any> = {}): this => {
			this.request.add("show", resource, id+"", params);
			return this;
		}
		store = (resource: string, model: IModel): this => {
			if(model.id) {
				return this.update(resource, model);
			}
			this.request.add("store", resource, null, model);
			return this;
		}
		update = (resource: string, model: IModel): this => {
			if(!model.id) {
				return this.store(resource, model);
			}
			this.request.add("update", resource, model.id+"", model);
			return this;
		}
		destroy = (resource: string, id: number, params: _.Dictionary<any> = {}): this => {
			this.request.add("destroy", resource, id+"", params);
			return this;
		}
		withDeleted = (include: boolean = true): this => {
			this.request.includeDeleted = include;
			return this;
		}
		reset() {
			this._request = null;
		}
		exec<T extends IApiResponse>(minutes?: number, canceler?: ng.IDeferred<any>): ng.IPromise<T> {
			let response = this.request.exec(canceler);

			this.reset();

			return response;
		}
	}

	angular.module("lt.core").service("$api", ApiService);
}
