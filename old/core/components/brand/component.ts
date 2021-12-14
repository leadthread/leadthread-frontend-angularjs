/// <reference path="../component.ts" />
namespace lt.components.brand {

    export class Controller extends lt.components.Controller {
    	static $inject: string[] = [];

        //Bindings
        public brand: Brand;

        protected run = () => {
        	
        }

        getLogoColor() {
        	return _.get(this, "brand.logo_background_color", "#FFFFFF");
        }
    }

    export class Component extends lt.components.Component {
    	public bindings:any;
        public controller:any;
        public controllerAs:string;
        public templateUrl:string;
 
        constructor() {
        	super();
            this.bindings = {
	            brand:"<",
	        };
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/brand/index.html";
        }
    }

    angular.module('lt.core').component("brand", new Component());
}
