import Controller from "./Controller"
import BaseComponent from "../Component"

export default class Component extends BaseComponent {
	bindings
	controller
	controllerAs
	templateUrl

	constructor() {
		super()
		this.bindings = {
			brands: "<",
			selected: "<",
			onBrandChange: "&",
		}
		this.controller = Controller
		this.controllerAs = "$ctrl"
		this.templateUrl = "components/brand-manager/index.html"
	}
}