import Controller from "./Controller"
import BaseComponent from "../Component"

export default class Component extends BaseComponent {
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
