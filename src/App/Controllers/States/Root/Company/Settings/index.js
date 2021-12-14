import _ from "lodash"
import Controller from "../../../Controller"

class SettingsController extends Controller {
	static $inject = ["$scope", "company", "brands", "$notification"]
	constructor($scope, company, brands, $notification) {
		super()
	}

	init() {}
	defineListeners() {
		this.$scope.$watch("company.name", this.saveCompany)
	}
	defineScope() {
		this.$scope.company = this.company
		this.$scope.brands = this.brands
		this.$scope.onBrandChange = this.onBrandChange
		this.saveCompany = _.debounce(this.saveCompany, 2000)
	}

	onBrandChange = (brand) => {
		if (this.company.brand_id !== brand.id) {
			this.company.brand = brand
			this.company.brand_id = brand.id
			this.saveCompany()
		}
	}

	saveCompany = () => {
		return this.company.save().then((c) => {
			this.$notification.success("Saved Settings")
			return c
		})
	}
}

const key = "SettingsController"
const fn = SettingsController

export const CompanySettings = {
	key,
	fn,
}
