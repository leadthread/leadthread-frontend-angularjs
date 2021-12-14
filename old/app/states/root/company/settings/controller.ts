namespace lt.app {
	interface ISettingsScope {
		company: Company;
		brands: Brand[];
		onBrandChange: Function;
		$watch: Function;
	}

	export class SettingsController extends StatesController {

		static $inject: string[] = ["$scope", "company", "brands", "$notification"];
		constructor(public $scope: ISettingsScope, protected company: Company, protected brands: Brand[], protected $notification: INotificationService){
			super();

		}

		init() {}
		defineListeners() {
			this.$scope.$watch("company.name", this.saveCompany);
		}
		defineScope() {
			this.$scope.company = this.company;
			this.$scope.brands = this.brands;
			this.$scope.onBrandChange = this.onBrandChange;
			this.saveCompany = _.debounce(this.saveCompany, 2000);
		}

		onBrandChange = (brand: Brand) => {
			if (this.company.brand_id !== brand.id) {
				this.company.brand = brand;
				this.company.brand_id = brand.id;
				this.saveCompany();
			}
		}

		saveCompany = () => {
			return this.company.save().then((c) => {
				this.$notification.success("Saved Settings");
				return c;
			});
		}
	}

	angular.module("lt.app").controller("SettingsController", SettingsController);
}