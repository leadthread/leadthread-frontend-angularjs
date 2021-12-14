/// <reference path="../component.ts" />
namespace lt.components.brandManager {

    export class Controller extends lt.components.Controller {
    	static $inject: string[] = ["$popup", "BrandFactory", "$stateParams"];

        //Bindings
        public brands: Brand[];
        public brand: Brand;
        public onBrandChange: Function;
        protected selected: number;

        public constructor(public $popup: IPopupService, protected BrandFactory: BrandFactory, protected $stateParams: ng.ui.IStateParamsService) {
            super();
        }

        protected run = () => {
        	this.selectBrand(_.find(this.brands, {id: this.selected}));
        }

        protected form (brand?: Brand): ng.IPromise<Brand> {
            var form: IPopupField[] = [
                {type: "input", subtype: "text",    label: "Company Name",          key: "name",                  value: _.get(brand, "name"),                             required: true},
                {type: "input", subtype: "text",    label: "Domain",                key: "domain",                value: _.get(brand, "domain"),                           required: false},
                {type: "color", subtype: null,      label: "Company Color",         key: "color",                 value: _.get(brand, "color", "#666666"),                 required: true},
                {type: "color", subtype: null,      label: "Logo Background Color", key: "logo_background_color", value: _.get(brand, "logo_background_color", "#FFFFFF"), required: true},
                {type: "image", subtype: "logo",    label: "Logo",                  key: "logo",                  value: _.get(brand, "logo"),                             required: true},
                {type: "image", subtype: "favicon", label: "Favicon",               key: "favicon",               value: _.get(brand, "favicon"),                          required: false},
                // {type: "input", subtype: "text",    label: "Homepage URL",          key: "homepage_url",          value: _.get(brand, "homepage_url"),                     required: false},
            ];


            return this.$popup.form(form, (brand?"Edit":"New")+" Brand", false, "lg")
                .then((x) => {
                    let a: _.Dictionary<any>;
                    if (brand) {
                        a = brand;
                        for (let prop in x) {
                            let y: any = x[prop];
                            a[prop] = y;
                        }
                    } else {
                        a = this.BrandFactory.create(x);
                    }

                    return a as Brand;
                })
                .then((brand) => { 
                    brand.company_id = this.$stateParams.companyId;
                    brand.logo_id = _.get<number>(brand, "logo.id", null);
                    brand.favicon_id = _.get<number>(brand, "favicon.id", null);
                    return brand;
                });
        }

        public edit (brand: Brand) {
            return this.form(brand).then(this.save);
        }

        public create () {
            return this.form().then(this.save).then((brand) => {
                this.brands.push(brand);
                this.selectBrand(brand);
            });
        }

        public destroy (brand: Brand) {
            brand.destroy().then(() => {
                _.remove(this.brands, {id: brand.id});
                this.selectBrand(_.find(this.brands, _.get<number>(this, "brands[0].id")));
            })
        }

        public save (brand: Brand) {
            return brand.save()
        }

        public selectBrand(brand: Brand) {
            if (brand) {
                this.brand = brand;
                this.selected = this.brand.id;
                this.onBrandChange()(this.brand);
            }
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
                brands:"<",
                selected:"<",
                onBrandChange:"&",
	        };
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/brand-manager/index.html";
        }
    }

    angular.module('lt.core').component("brandManager", new Component());
}
