import SectionController from "../Controller"

export default class Controller extends SectionController {
	static $inject = []

	//Bindings
	model
	options

	$onInit() {
		this.run()
	}

	constructor() {
		super()
	}

	run = () => {}

	validIncentive() {
		let incentive = this.options.incentive
		return incentive && !incentive.isEmpty()
	}

	/*=====  End of Add to any  ======*/
}
