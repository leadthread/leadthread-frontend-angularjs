import Controller from "../../Controller"
import Component from "../../../Core/Components/Component"

class ControlBarController extends Controller {
	static $inject = []

	//Bindings
	controls
	onChange

	run = () => {}

	update = () => {
		let x = {}
		for (let key in this.controls) {
			x[key] = this.controls[key].value
		}
		return this.onChange()(x)
	}
}

class ControlBarComponent extends Component {
	bindings
	controller
	controllerAs
	templateUrl

	constructor() {
		super()
		this.bindings = {
			controls: "<",
			onChange: "&",
		}
		this.controller = ControlBarController
		this.controllerAs = "$ctrl"
		this.templateUrl = "components/control-bar/index.html"
	}
}

export const ControlBar = {
	key: "controlBar",
	fn: new ControlBarComponent(),
}
