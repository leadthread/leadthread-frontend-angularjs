/* global a2a:false */
declare var a2a: any

namespace lt.components.section.share {

    interface IA2AShareData {
        url: string;
        title: string;
        stop: boolean;
        node: any;
    }

    interface ISocialRequirements {
        urlForButtons:string;
        urlForCopyPaste:string;
        message: string;
        urlForSms?: string;
    }

    export class Controller extends lt.components.section.Controller {
    	static $inject = ["$q", "$device", "$timeout", "$popup", "$http", "$notification", "$sms", "$rootScope", "EventService", "ContactService"];

        //Bindings
        public model: ISection;
		public options: ISiteOptions;

		//Properties
        public message: string;
        public urlForButtons: string;
        public urlForSms: string;
		public urlForCopyPaste: string;
		public copyPaste: string;
		public lock: string;

		$onInit(): void {
        	this.run();
		}

        constructor(public $q: ng.IQService, public $device: IDeviceService, public $timeout: ng.ITimeoutService, public $popup: IPopupService, public $http: ng.IHttpService, public $notification: INotificationService, public $sms: ISmsService, private $rootScope: ng.IRootScopeService, private EventService: EventService, private ContactService: ContactService) {
			super();
        	this.options = <ISiteOptions>{};
        	this.model = <ISection>{};
        	this.lock = "Loading";
        };

        protected run = (): ng.IPromise<any> => {
        	let self = this;

        	// Values
        	self.message = "";
        	self.urlForButtons = "";
        	self.urlForSms = "";
        	self.urlForCopyPaste = "";
        	self.copyPaste = "";
			self.lock = "Loading";
			
			if (!this.options.contact) {
				return this.contactForm().then((link: ILink) => {
					console.log(link);
					window.location.href = link.long_url;
				});
			}

        	return self.getSocialRequirements().then(function(resp: ISocialRequirements) {
        		var m = _.get(resp, "message", ""),
        			ufb = _.get(resp, "urlForButtons", ""),
        			ufcp = _.get(resp, "urlForCopyPaste", ""),
					ufs = _.get(resp, "urlForSms", "");
					
        		self.message = m;
        		self.urlForButtons = ufb;
        		self.urlForSms = ufs;
        		self.urlForCopyPaste = ufcp;
        		self.copyPaste = _([m, ufcp]).compact().join(" ");

        		return self.a2aInit()
        			.then(self.unlock);
        	}).catch(function (reason) {
        		self.unlock();
        		self.$notification.error("Error", reason);
                throw reason;
        	});
        }

        /**
         * Unlocks the page
         */
        unlock = (): void => {
        	this.lock = null;
        }

        /**
         * Mark the current link as sent then create a new link to use
         * @param  string  sent_via The channel that the link was sent on
         * @return promise          A promise containing the new url
         */
        onSend = (sent_via: string): ng.IPromise<Event> => {
            let y = this.EventService.record(this.options.link, "sent_" + sent_via);
        	let x = this.$http.post("/api/v1/links/sent-via", {long_url: this.urlForButtons, sent_via: sent_via});
        	x.then(this.run);
            return y;
        }

        getUrl(sent_via: string): ng.IPromise<string> {
			let self = this;
        	return self.$q.when(_.isFunction(self.options.getUrlFn) ? self.options.getUrlFn({sent_via: sent_via}) : {}).then((x: ILink) => {
				return x.long_url;
			});
        }

        getMessage(): ng.IPromise<string> {
        	let self = this;
        	return self.$q.when(_.isFunction(self.options.getMsgFn) ? self.options.getMsgFn() : "");
        }

        /**
         * Builds the social requirements
         */
        getSocialRequirements(): ng.IPromise<ISocialRequirements> {
        	let self = this;
        	return self.$q.all({
        		urlForButtons: self.getUrl(null),
        		urlForCopyPaste: self.getUrl("copy_paste"),
        		message: self.getMessage(),
        	}).then(function (x: ISocialRequirements) {
                let promises: {[key: string]: ng.IPromise<any>} = _.merge(x, {
                    urlForSms: self.$sms.getSmsHref(x.message, x.urlForButtons),
                });
        		return self.$q.all(promises);
        	});
        }

        onSmsClick = (): void => {
            let url = this.urlForSms;
        	this.onSend("sms").then(() => {
        	    location.href = url;
            });
        }

        goNext() {
            this.$rootScope.$broadcast("SiteNext");
        }

        goPrev() {
            this.$rootScope.$broadcast("SitePrev");
		}

        /*==================================
        =            Add to any            =
        ==================================*/

        /**
         * Binds "Add To Any" to the DOM
         * @param  object  a2a_config Add To Any configuration options
         * @return promise            Promise containing the a2a instance
         */
        a2aInit = (a2a_config: any = {}) => {
        	let self = this;
        	if (typeof a2a !== "undefined") {
        		return self.$timeout(() => {
        			// Setup AddToAny "onShare" callback function
        			a2a_config = a2a_config || {};
        			a2a_config.callbacks = a2a_config.callbacks || [];
        			a2a_config.callbacks.push();

        			return a2a.init("page", {
        				target: ".a2a_init",
        				show_title:true,
        				num_services:999,
        				templates:{
        					twitter: "${title} ${link}",
        					email: {
        						subject: "${title}",
        						body: "${title}\n${link}"
        					}
        				},
        				callbacks: [{
        					share: self.a2aOnShare
        				}],
        			});
        		}, 1);
        	} else {
        		return self.$q.reject("a2a is undefined");
        	}
        }

        /**
         * Called when a user clicks on an "Add To Any" share option
         * @param  object share_data Data containing information for which button they clicked
         * @return object            Modified version of "share_data"
         */
        a2aOnShare = (share_data: IA2AShareData): IA2AShareData => {
        	let cancel: boolean = false;
        	let sent_via: string = share_data.node.a2a.safename;
        	let url: string = share_data.url;
        	let title: string = share_data.title;

        	// Mark it as sent and get a new url ready
        	this.onSend(sent_via);

        	// Cancel share if the request failed
        	if (cancel) {
        		return _.merge(share_data, {
        			stop: true
        		});
        	}

        	// Modify the share by returning an object with
        	// "url" and "title" properties containing the new URL and title
        	return _.merge(share_data, {
        		url: url,
        		title: title
        	});

        }

        /**
         * Opens the "Add To Any" menu that contains other sharing options
         * @param  object e The click event
         * @return void
         */
        a2aShowMenu(e: _Event): void {
        	if (typeof a2a !== "undefined") {
        		e.preventDefault();
        		a2a.show_full();
        	}
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
            this.templateUrl = "components/section/share/index.html";
        }
    }

    angular.module('lt.core').component("sectionShare", new Component());
}
