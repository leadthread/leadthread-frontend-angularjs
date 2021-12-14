export default class Controller {
	$onInit() {
		this.defineScope()
		this.defineListeners()
		this.definePlaceholders()
		this.init()
	}

	init() {}

	defineScope() {}

	defineListeners() {}

	definePlaceholders() {}
}
