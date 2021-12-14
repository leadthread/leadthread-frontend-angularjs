/// <reference path="../../../core/components/component.ts" />
namespace lt.components.controlBar {

    export class Controller extends lt.components.Controller {
    	static $inject: string[] = [];

        //Bindings
        public controls: IControl[];
        public onChange: Function;

        protected run = () => {
        	
        }

        protected update = () => {
            let x = {};
            for (let key in this.controls) {
                x[key] = this.controls[key].value;
            }
            return this.onChange()(x);
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
                controls:"<",
                onChange:"&",
	        };
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/control-bar/index.html";
        }
    }

    angular.module('lt.app').component("controlBar", new Component());
}
