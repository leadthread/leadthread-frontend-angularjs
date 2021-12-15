import Controller from "./Controller"
import SectionComponent from "../Component"

export default class Component extends SectionComponent {
	bindings
	controller
	controllerAs
	template

	constructor() {
		super()
		this.bindings = {
			model: "<",
			options: "<",
		}
		this.controller = Controller
		this.controllerAs = "$ctrl"
		this.template = require("./index.html")
	}
}
