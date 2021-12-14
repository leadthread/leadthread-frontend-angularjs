/// <reference path="../../../core/components/component.ts" />
namespace lt.components.pagination {

	interface IPagination {
		page: number;
		limit: number;
		total: number;
	}

    export class Controller extends lt.components.Controller {
    	static $inject: string[] = ["$q"];

        //Bindings
        public service: ModelService;
        public params: Function;
        public models: Model[];
        public pagination: IPagination;
        public loading: string;
        public id: string;
        public related: boolean;

        constructor(protected $q: ng.IQService) {
            super();
            this.loading = null;
            this.id = "pagination-"+Math.round(Math.random()*1000)
        	this.pagination = {
				page: 1,
				limit: 20,
				total: 0,
            }
        }

        $onChanges(changes) {
            let params = _.get(changes, "params.currentValue", null)
            if (params) {
                this.params = params;
                this.load(1, this.params);
            }
        }

        protected run = () => {
            this.load(this.pagination.page, this.params)
        }

        public onPageChange(page) {
            this.load(page, this.params)
        }

        protected load = (page: number = 1, params = {}): ng.IPromise<IApiListResponse<Model>> => {
            this.loading = "Loading..."
			let promise = this.service.paginate(page, this.pagination.limit, params);
			
			promise.then((x: IApiListResponse<Model>) => {
				let promises: ng.IPromise<Model>[] = _.map(x.data, (c: Model) => {
					return c.load(this.related);
				});
				
				return this.$q.all(promises);
			});

			return promise.then((x: IApiListResponse<SmsBatch>) => {
				this.loading = null;
				this.models = x.data;
				this.pagination.total = x.meta.total;
				this.pagination.page = page;
				return x;
			});
		}
    }

    export class Component extends lt.components.Component {
    	public bindings: any;
        public controller: any;
        public controllerAs: string;
        public templateUrl: string;
        public transclude: boolean;
 
        constructor() {
        	super();
            this.bindings = {
                service:"<",
                params:"<",
                related:"<",
            };
            this.transclude = true;
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/pagination/index.html";
        }
    }

    angular.module('lt.app').component("pagination", new Component());
}
