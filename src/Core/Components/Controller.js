import CoreController from "../Controller"

export default class Controller extends CoreController {
	//Bindings
	model
	options

	constructor() {
		super()
		this.options = {}
		this.model = {}
	}
}
