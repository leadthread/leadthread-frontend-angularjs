namespace lt {
	export abstract class Controller implements ng.IController {
		$onInit() {
		    this.defineScope();
		    this.defineListeners();
		    this.definePlaceholders();
		    this.init()
		}

		protected abstract init(): void;

		protected abstract defineScope(): void;

		protected abstract defineListeners(): void;

		protected definePlaceholders(): void {
			
		};
	}
}