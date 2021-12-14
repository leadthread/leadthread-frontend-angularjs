namespace lt.components {

	export abstract class Controller {
		$onInit(): void {
			this.run();
		}

		protected abstract run = () => {};
	}

	export class Component implements ng.IComponentOptions {

	}
}