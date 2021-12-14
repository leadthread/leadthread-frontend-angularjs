/// <reference path="../component.ts" />
/// /* global a2a:false */
declare var a2a: any

namespace lt.components.incentive {

    export class Controller extends lt.components.Controller {

    	static $inject: string[] = [];

        //Bindings
        public incentive: IIncentive;

		$onInit(): void {
        	this.run();
		}

        constructor() {
        	super();
        };

        protected run = () => {
        	
        }

        /*=====  End of Add to any  ======*/
    }

    export class Component extends lt.components.Component {
    	public bindings:any;
        public controller:any;
        public controllerAs:string;
        public templateUrl:string;
 
        constructor() {
        	super();
            this.bindings = {
	            incentive:"<",
	        };
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/incentive/index.html";
        }
    }

    angular.module('lt.core').component("incentive", new Component());
}
