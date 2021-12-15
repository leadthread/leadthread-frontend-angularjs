import Controller from "./Controller"
import BaseComponent from "../Component"

export default class Component extends BaseComponent {
	bindings
	controller
	controllerAs
	template

	constructor() {
		super()
		this.bindings = {
			brand: "<",
		}
		this.controller = Controller
		this.controllerAs = "$ctrl"
		this.template = require("./index.html")
	}
}
