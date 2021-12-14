namespace lt {

	/**
	 * 1. Is this the mobile app?
	 *     - Use the cordova plugin -> https://github.com/cordova-sms/cordova-sms-plugin
	 * 2. Is this running in the browser on a mobile device?
	 *     - Use the hyperlink method -> http://stackoverflow.com/questions/6480462/how-to-pre-populate-the-sms-body-text-via-an-html-link
	 * 3. Is this neither? 
	 *     - Use Bandwidth -> http://bandwidth.com
	**/
	export class SmsService implements ISmsService {
		static $inject = ["$q", "$notification", "$popup", "$http", "$device"];
		constructor(protected $q: ng.IQService, protected $notification: ng.IQService, protected $popup: IPopupService, protected $http: ng.IHttpService, protected $device: IDeviceService) {}

		public sendInvite (contactIds: number|number[], message: string, company_id: number, campaign_id: number, user_id: number = null): ng.IPromise<any> {
			if (!_.isArray(contactIds)) {
				contactIds = [contactIds];
			}

			return this.$http.post("/api/v1/sms/send/campaign", {
				contact_id:contactIds.join("+"),
				message:message,
				company_id:company_id,
				campaign_id:campaign_id,
				user_id:user_id,
			});
		}

		public getSmsHref (message: string, url?: string, person?: IPerson, includeResend: boolean = false): ng.IPromise<string> {
			return this.getSmsHrefObject(message, url, person, includeResend).then(function (x) {
				return x.href;
			});
		}

		public getSmsHrefObject (message: string, url?: string, person?: IPerson, includeResend: boolean = false): ng.IPromise<ISmsHref> {
			return this.$q.all({
				url: this.getUrl(url, person),
				message: this.getMessage(message, person),
				phone: this.getPhone(person),
				href: null,
			}).then((x) => {
				x = _.merge(x, {
					href: this.getHref(x.message, x.url, x.phone, includeResend),
				});
				return this.$q.all(x);
			});
		}

		protected getHref (message: string, url: string, phone?: string|Telephone, includeResend: boolean = false) {
			if (phone instanceof Telephone) {
				phone = phone.valueOf();
			}

			let href = "sms:" + _.defaultTo(phone, "");

			if (_.isString(url)) {
				let resend = "If the link doesn\'t work, tell me to resend it."
				if (includeResend) {
					let diff = ((message+" "+url).length % 140);
					if (diff > 0 && diff < url.length) {
						message += " " + resend + " " + url;
					} else {
						message += " " + url + " " + resend;
					}
				} else {
					// Add on the url to the end
					message += " " + url;
				}
			}

			if (_.isString(message) && message.length > 0 && message!=="null") {
				message = encodeURIComponent(message);
				message = message.replace("%26", "and");
				if (this.$device.isApple()) {
					if (this.$device.iOSVersion() >= 8) {
						href += "&body=" + message;
					} else {
						href += ";body=" + message;
					}
				} else {
					href += "?body=" + message;
				}
			}

			return this.$q.when(href);
		}

		protected getPhone(person: IPerson): ng.IPromise<Telephone|string> {
			let phone = _.get(person, "phone", null);

			if (!_.isEmpty(phone) && !(phone instanceof Telephone)) {
				try {
					phone = new Telephone(phone);
				} catch (e) {
					phone = null;
				}
			} 

			return this.$q.when(phone);
		}

		/**
		 * Gets the url to attach to the end of the text message
		 * @param  {Function|String} url     The url function or string to attach
		 * @param  {Person}          person The person the url is intended for
		 * @return {Promise}
		 */
		protected getUrl (url: string|Function, person: IPerson) {
			let x = null;

			if (_.isFunction(url)) {
				let options: IUrlOptions = {
					sent_via: "sms",
				};

				if (person) {
					options.person = person;
				}

				x = url(options);
			} else if (_.isString(url)) {
				x = url;
			}

			return this.$q.when(x);
		}

		/**
		 * Gets the sms message text by opening up a modal form if needed
		 * @param  {Function|String} message The text message function or string to send
		 * @param  {Person}          person The person that this message is intended for
		 * @param  {Boolean}         force   Force the modal popup if needed
		 * @return {Promise}
		 */
		protected getMessage (message: string|Function, person: IPerson, force: boolean = false) {
			let promise,
				options: {person?: IPerson} = {};

			if (typeof message === "function") {
				if (person) {
					options.person = person;
				}

				message = <string>message(options);
			}

			if (force !== true) {
				promise = this.$q.when(message);
			} else {
				promise = this.$popup.textarea("message", message, "What is the message you would like to send?");
			}

			return promise.then(function (x) {
				return _.isString(x) ? x : _.get(x, "message", null);
			});
		}
	}

	angular.module("lt.core").service("$sms", SmsService);
}