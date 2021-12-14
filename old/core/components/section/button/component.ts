namespace lt.components.section.button {

    export class Controller extends lt.components.section.Controller {
        static $inject = ["$rootScope", "$timeout", "$placeholder", "$q", "$http", "$popup", "$sms", "$notification", "$cache", "EventService"];

        //Bindings
        public first: string;
        public last: string;

        //Properties
        public smsHref: string;

        constructor(private $rootScope: ng.IRootScopeService, private $timeout: ng.ITimeoutService, private $placeholder: IPlaceholderService, private $q: ng.IQService, private $http: ng.IHttpService, private $popup: IPopupService, private $sms: ISmsService, private $notification: INotificationService, private $cache: ICacheService, private EventService: EventService) {
            super();
        }

        protected run = () => {
            if(_.isEmpty(this.model.text)) {
                this.model.text = this.model.type == "nav" ? "Next" : "Click Here";
            }

            this.loadSmsHref();
        }

        getIconClass(icon: string): string {
            if(icon === "earphone") {
                icon = "phone";
            }
            return "icon-"+icon;
        }

        getButtonStyle(): IStyle {
            var style = <IStyle>{
                "background": this.model.button_color,
                "color": this.model.font_color,
                "border-radius": this.model.button_border_radius,
                "border": this.model.button_border_width+"px solid "+this.model.button_border_color,
                "line-height": "125%",
                "height": "auto",
            };
            return style;
        }

        parse(str: string): string {
            return this.$placeholder.parse(str);
        }

        doRegister(): ng.IPromise<{referral: IReferral, link: ILink}> {
            let clickedPromise = this.record("register");
            let link: ILink = _.get<ILink>(this, "options.link");
            let referral: Referral|ng.IPromise<IReferral> = _.get<Referral>(this, "options.referral");

            referral = this.getPersonFromPopup(referral);

            return this.$q.when(referral).then((referral: IReferral) => {
                return this.signup(referral, link, this.parse(this.model.text));
            }).then((x: {referral: IReferral, link: ILink}): {referral: IReferral, link: ILink} => {
                let message = _.get(this, "model.success_message", "Thank You. We will contact you with more information.");
                this.$notification.success(message);
                return x;
            });
        }

        doUrl(href: string): void {
            let self = this;

            self.record("url").then(function() {
                location.href = self.fixUrl(href);
            });
        }

        doCall(): void {
            this.record("call").then(() => {
                location.href = "tel:"+this.getPhone();
            });
        }

        doEmail() {
            let email = this.getEmail();
            if(email){
                this.record("email").then(() => {
                    window.location.href = "mailto:"+email;
                });
            }
        }

        doSms() {
            if(this.smsHref){
                this.record("sms").then(() => {
                    window.location.href = this.smsHref;
                });
            }
        }

        signup = (referral: IReferral, link: ILink, button: string): ng.IPromise<{referral: IReferral, link: ILink}> => {
            let key = "signup-link-"+link.id;

            return this.$cache.remember(key, 1440, () => {
                if(referral instanceof Referral) {
                    referral = referral.valueOf();
                }
                return this.$http.post<IApiItemResponse<{referral: IReferral, link: ILink}>>("/api/v1/links/"+link.id+"/signup", {
                    "referral": referral,
                    "events": _.map(this.EventService.recorded, "id"),
                    "button": button,
                }).then(function (response) {
                    return response.data.data;
                });
            });
        }

        fixUrl(url: string) {
            if(_.isString(url)) {
                var idx1 = url.indexOf("http://");
                var idx2 = url.indexOf("https://");
                if(idx1 === -1 && idx2 === -1) {
                    url = "http://"+url;
                }
            }
            return url;
        }

        getPhone() {
            var phoneButton = _.get(this, "model.phone", null);
            var phoneUser = _.get(this, "options.owner.phone", null);                     
            return phoneButton ? phoneButton : phoneUser;
        }

        getEmail() {
            var emailButton = _.get(this, "model.email", null);
            var emailUser = _.get(this, "options.owner.email", null);                     
            return emailButton ? emailButton : emailUser;
        }

        loadSmsHref() {
            let self = this;
            if(!self.smsHref) {
                var o = self.options.owner;
                if(_.isObject(o) && o.first_name && o.last_name) {
                    if (self.getPhone()) {
                        o.phone = self.getPhone();
                    }
                    self.$sms.getSmsHref(null, null, o).then(function(resp) {
                        self.smsHref = resp;
                    });
                } else {
                    self.smsHref = "sms:";
                }
            }
        }

        record(type: string, link: ILink = null) {
            link = link || _.get<ILink>(this, "options.link");
            if(link) {
                return this.EventService.record(link, "clicked_"+type);
            } else {
                return this.$q.reject("Link object not found");
            }
        }

        goNext() {
            this.$rootScope.$emit("SiteNext");
        }

        goPrev() {
            this.$rootScope.$emit("SitePrev");
        }

        getPersonFromPopup(referral?: IReferral, collectCompany: boolean = false): ng.IPromise<IReferral> {
            let form: IPopupField[] = [];

            form.push({type: "input", subtype: "text",  label: "First Name",      key: "first_name", value: _.get(referral, "first_name"), required: true});
            form.push({type: "input", subtype: "text",  label: "Last Name",       key: "last_name",  value: _.get(referral, "last_name"),  required: true});
            form.push({type: "input", subtype: "tel",   label: "Mobile Number",   key: "phone",      value: _.get(referral, "phone"),      required: true});
            form.push({type: "input", subtype: "email", label: "Email",           key: "email",      value: _.get(referral, "email"),      required: true});

            if (collectCompany) {
                form.push({type: "input", subtype: "text", label: "Company(Optional)", key: "company", value: _.get(referral, "company"), required: false});
            }

            return this.$popup.form(form, this.model.text);
        }
    }

    export class Component extends lt.components.section.Component {
        //Properties
        public bindings:any;
        public controller:any;
        public controllerAs:string;
        public templateUrl:string;

        constructor() {
            super();
            this.bindings = {
                model:"<",
                options: "<",
                first:"&",
                last:"&",
            };
            this.controller = Controller;
            this.controllerAs = "$ctrl";
            this.templateUrl = "components/section/button/index.html";
        }
    }

    angular.module('lt.core').component("sectionButton", new Component());
}
