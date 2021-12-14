namespace lt.app {
	interface IConsoleScope {
		$watch: Function;
		getCompaniesByName: Function;
		getBrandsForCompany: Function;
		onBrandChange: Function;
		company: Company;
		brands: Brand[];
		create: Function;
		edit: Function;
		lock: string;
	}

	export class ConsoleController extends Controller {
		static $inject: string[] = ["$scope", "$state", "$location", "$q", "$popup", "CompanyService", "CompanyFactory", "BrandService", "company"];
		constructor(public $scope: IConsoleScope, protected $state: ng.ui.IStateService, protected $location: ng.ILocationService, protected $q: ng.IQService, protected $popup: IPopupService, protected CompanyService: CompanyService, protected CompanyFactory: CompanyFactory, protected BrandService: BrandService, protected company: company) {
			super();
		}

		defineScope() {
			this.$scope.getCompaniesByName = this.getCompaniesByName;
			this.$scope.company = this.company;
			this.$scope.create = this.create;
			this.$scope.edit = this.edit;
			this.$scope.lock = null;
			this.$scope.onBrandChange = this.onBrandChange;
		}

		defineListeners() {
			this.$scope.$watch("company.id", (id: number) => {
				this.$location.search("companyId", id);

				this.$scope.brands = null;
				this.getBrandsForCompany(this.$scope.company).then((brands) => {
					this.$scope.brands = brands;
				});
			});
		}

		init() {

		}

		create = (): ng.IPromise<Company> => {
			return this.form()
				.then(this.save)
				.then((company: Company) => {
					this.$scope.company = company;
					return company;
				});
		}

		edit = (company: Company): ng.IPromise<Company> => {
			return this.form(company).then(this.save);
		}

		save = (company: Company): ng.IPromise<Company> => {
			this.$scope.lock = "Saving..."
		    return company.save().then((c) => {
		    	this.$scope.lock = null;
		    	return c;
		    });
		}
		
		onBrandChange = (brand: Brand) => {
			if (brand.id && this.$scope.company.brand_id !== brand.id) {
				this.$scope.company.brand_id = brand.id;
				this.save(this.$scope.company);
			}
		}

		protected form = (company?: Company): ng.IPromise<Company> => {
		    var form: IPopupField[] = [
		        {type: "input",  subtype: "text", label: "Account Name",   key: "name",   value: _.get(company, "name"),   required: true},
				{
					type: "select", subtype: null, label: "Account Status", key: "status", value: _.get(company, "status"), required: true, choices: {
						"Enabled": "enabled",
						"Trial": "trial",
						"Disabled": "disabled"
					}
				},
				{
					type: "select", subtype: null, label: "Account Type", key: "type", value: _.get(company, "type"), required: true, choices: {
						"Recruiting": "recruiting",
						"Sales": "sales",
					}
				},
				{
					type: "input",  subtype: "text", label: "Number of Employees/Customers",   key: "employees_count",   value: _.get(company, "employees_count"),   required: true
				},
				{
					type: "input",  subtype: "text", label: "Glassdoor URL",   key: "glassdoor_url",   value: _.get(company, "glassdoor_url")
				},
				{
					type: "input",  subtype: "text", label: "Indeed URL",   key: "indeed_url",   value: _.get(company, "indeed_url")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Referral", key: "module_referral", value: _.get(company, "module_referral")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Leaderboard", key: "module_leaderboard", value: _.get(company, "module_leaderboard")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Message", key: "module_message", value: _.get(company, "module_message")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Testmonial", key: "module_testimonial", value: _.get(company, "module_testimonial")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Recognition", key: "module_recognition", value: _.get(company, "module_recognition")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Reach", key: "module_reach", value: _.get(company, "module_reach")
				},
				{
					type: "input", subtype: "checkbox", label: "Module Reviews", key: "module_reviews", value: _.get(company, "module_reviews")
				},
		    ];

		    return this.$popup.form(form, (company?"Edit":"New")+" Account", false, "lg")
		        .then((x) => {
		            let a: _.Dictionary<any>;
		            if (company) {
		                a = company;
		                for (let prop in x) {
		                    let y: any = x[prop];
		                    a[prop] = y;
		                }
		            } else {
		                a = this.CompanyFactory.create(x);
		            }

		            return a as Company;
		        });
		}

		getCompaniesByName = (name: string): ng.IPromise<Company[]> => {
			return this.CompanyService.index({name: name})
		}

		getBrandsForCompany = (company: Company): ng.IPromise<Brand[]> => {
			return this.BrandService.indexFor("companies", company.id, {company_id: company.id}).then((brands) => {
				return this.$q.all(_.map(brands, (brand) => {
					return brand.load(true);
				}));
			});
		}
	}

	angular.module("lt.app").controller("ConsoleController", ConsoleController);
}
