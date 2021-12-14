/* global a2a:false */
declare var a2a: any

namespace lt.components.section.incentive {

    export class Controller extends lt.components.section.Controller {

    	static $inject: string[] = [];

        //Bindings
        public model: ISection;
		public options: ISiteOptions;

		$onInit(): void {
        	this.run();
		}

        constructor() {
        	super();
        };

        protected run = () => {
        }
 
        validIncentive() {
            let incentive = this.options.incentive as Incentive;
            return incentive && !incentive.isEmpty();
        }

        /*=====  End of Add to any  ======*/
    }

    export class Component extends lt.components.section.Component {
    	public bindings:any;
        public controller:any;
        public controllerAs:string;
        public templateUrl:string;
 
        constructor() {
        	super();
            this.bindings = {
	            model:"<",
	            options: "<",
	        };
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/section/incentive-preview/index.html";
        }
    }

    angular.module('lt.core').component("sectionIncentivePreview", new Component());
}
