namespace lt.app {
	interface ICompanySelectScope {
		$watch: Function;
		companies: Company[];
		search: ISearch;
		loading: string;
		logout: Function;
		showDisabledAt: Function;
		selectCompany: Function;
		pagination: IPagination;
		onPageChange: Function;
		favicons: IFaviconPaths;
		isSuperAdmin: boolean;
	}

	interface ISearch extends _.Dictionary<any> {
		name: string;
	}

	interface IPagination {
		page: number;
		limit: number;
		total: number;
	}

	interface ILoadResponse {
		companies: Company[];
		total: number;
	}

	interface IFaviconPaths {
		[id: number]: string;
	}

	export class CompanySelectController extends StatesController {
		static $inject: string[] = ["$scope", "$q", "$api", "$state", "$auth", "$cache", "CompanyService", "$httpParamSerializer"];
		constructor(public $scope: ICompanySelectScope, protected $q: ng.IQService, protected $api: IApiService, protected $state: ng.ui.IStateService, protected $auth: IAuthService, protected $cache: ICacheService, protected CompanyService: CompanyService, protected $httpParamSerializer: ng.IHttpParamSerializer) {
			super();
			this.onSearchChange = _.throttle(this.onSearchChange, 1000, {'leading': false, 'trailing': true});
		}

		defineScope () {
			this.$scope.loading = null;
			this.$scope.onPageChange = this.onPageChange;
			this.$scope.logout = this.logout;
			this.$scope.search = {name: ""};
			this.$scope.companies = [];
			this.$scope.showDisabledAt = this.showDisabledAt;
			this.$scope.selectCompany = this.selectCompany;
			this.$scope.favicons = {};
			this.$scope.pagination = {
				page: 1,
				limit: 24,
				total: 0,
			}
		}

		defineListeners() {
			this.$scope.$watch("search.name", () => {
				return this.onSearchChange(this.$scope.search);
			});
		}

		load = (page: number = 1): ng.IPromise<IApiListResponse<Company>> => {
			this.$scope.loading = "Loading";
			this.$scope.companies = [];
			let user_id = this.$auth.getUserId();
			let pagination = this.$scope.pagination;
			let searchName = this.$scope.search.name;
			let params = _.merge({}, this.$scope.search);
			let promise = this.CompanyService.paginate(pagination.page, pagination.limit, params);
			
			promise.then((x) => {
				let promises: ng.IPromise<Company>[] = _.map(x.data, (c: Company) => {
					return c.load(true);
				});
				
				return this.$q.all(promises).then((companies: Company[]) => {
					_.forEach(companies, (c) => {
						let fingerprint = _.get(c, "brand.favicon.fingerprint");
						if(fingerprint) {
							this.$scope.favicons[c.id] = "/files/"+fingerprint+"/stretch/64/64";
						}
					});
					return x;
				});
			});

			return promise.then((x: IApiListResponse<Company>) => {
				if(searchName == this.$scope.search.name) {
					this.$scope.loading = null;
					this.$scope.companies = x.data;
					this.$scope.pagination.total = x.meta.total;
				}
				return x;
			});
		}

		showDisabledAt(company: Company): boolean {
			return _.get(company, "disabled_at", null);
		}

		selectCompany = (id: number): void => {
			this.$scope.loading = "Loading";
			this.$state.go("root.company.dashboard", {companyId: id});
		}

		logout = () => {
			return this.$auth.logout();
		}

		onPageChange = (page: number) => {
			this.load(page);
		}

		onSearchChange = (search: ISearch) => {
			this.load(1);
		}
		
		init() {
			this.onPageChange(1);
			this.$auth.isSuperAdmin().then((isSuperAdmin) => {
				this.$scope.isSuperAdmin = isSuperAdmin;
			})
		}
	}

	angular.module("lt.app").controller("CompanySelectController", CompanySelectController);
}
