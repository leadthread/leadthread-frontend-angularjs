import _ from "lodash"

import ComponentController from "../Controller"

export default class Controller extends ComponentController {
	static $inject = []

	//Bindings
	brand

	run = () => {}

	getLogoColor() {
		return _.get(this, "brand.logo_background_color", "#FFFFFF")
	}
}
