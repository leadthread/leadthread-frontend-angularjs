import Controller from "./Controller"
import SectionComponent from "../Component"

export default class Component extends SectionComponent {
	constructor() {
		super()
		this.bindings = {
			model: "<",
			options: "<",
			first: "&",
			last: "&",
		}
		this.controller = Controller
		this.controllerAs = "$ctrl"
		this.template = require("./index.html")
	}
}
