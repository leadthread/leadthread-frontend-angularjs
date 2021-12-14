namespace lt.components.section {

	export abstract class Controller extends lt.components.Controller {
		//Bindings
		public model: ISection;
		public options: ISiteOptions;

		constructor() {
			super();
		    this.options = <ISiteOptions>{};
		    this.model = <ISection>{};
		};
	}

	export class Component implements lt.components.Component {

	}
}