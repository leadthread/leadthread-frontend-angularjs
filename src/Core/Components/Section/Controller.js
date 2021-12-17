import ComponentController from "../Controller"
export default class Controller extends ComponentController {
	constructor() {
		super()
		this.$onInit()
	}

	$onInit() {
		this.run()
	}

	run = () => {}
}
