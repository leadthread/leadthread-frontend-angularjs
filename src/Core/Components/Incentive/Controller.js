import ComponentController from "../Controller"

export default class Controller extends ComponentController {
	static $inject = []

	//Bindings
	incentive

	$onInit() {
		this.run()
	}

	constructor() {
		super()
	}

	run = () => {}

	/*=====  End of Add to any  ======*/
}
