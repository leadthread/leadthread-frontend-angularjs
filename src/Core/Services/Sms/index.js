import _ from "lodash"
import { TelephoneClass as Telephone } from "../../Classes"

/**
 * 1. Is this the mobile app?
 *     - Use the cordova plugin -> https://github.com/cordova-sms/cordova-sms-plugin
 * 2. Is this running in the browser on a mobile device?
 *     - Use the hyperlink method -> http://stackoverflow.com/questions/6480462/how-to-pre-populate-the-sms-body-text-via-an-html-link
 * 3. Is this neither?
 *     - Use Bandwidth -> http://bandwidth.com
 **/
class SmsService {
	static $inject = ["$q", "$notification", "$popup", "$http", "$device"]
	constructor($q, $notification, $popup, $http, $device) {
		this.$q = $q
		this.$notification = $notification
		this.$popup = $popup
		this.$http = $http
		this.$device = $device
	}

	sendInvite(contactIds, message, company_id, campaign_id, user_id = null) {
		if (!_.isArray(contactIds)) {
			contactIds = [contactIds]
		}

		return this.$http.post("/api/v1/sms/send/campaign", {
			contact_id: contactIds.join("+"),
			message: message,
			company_id: company_id,
			campaign_id: campaign_id,
			user_id: user_id,
		})
	}

	getSmsHref(message, url, person, includeResend = false) {
		return this.getSmsHrefObject(message, url, person, includeResend).then(
			function (x) {
				return x.href
			}
		)
	}

	getSmsHrefObject(message, url, person, includeResend = false) {
		return this.$q
			.all({
				url: this.getUrl(url, person),
				message: this.getMessage(message, person),
				phone: this.getPhone(person),
				href: null,
			})
			.then((x) => {
				x = _.merge(x, {
					href: this.getHref(
						x.message,
						x.url,
						x.phone,
						includeResend
					),
				})
				return this.$q.all(x)
			})
	}

	getHref(message, url, phone, includeResend = false) {
		if (phone instanceof Telephone) {
			phone = phone.valueOf()
		}

		let href = "sms:" + _.defaultTo(phone, "")

		if (_.isString(url)) {
			let resend = "If the link doesn't work, tell me to resend it."
			if (includeResend) {
				let diff = (message + " " + url).length % 140
				if (diff > 0 && diff < url.length) {
					message += " " + resend + " " + url
				} else {
					message += " " + url + " " + resend
				}
			} else {
				// Add on the url to the end
				message += " " + url
			}
		}

		if (_.isString(message) && message.length > 0 && message !== "null") {
			message = encodeURIComponent(message)
			message = message.replace("%26", "and")
			if (this.$device.isApple()) {
				if (this.$device.iOSVersion() >= 8) {
					href += "&body=" + message
				} else {
					href += ";body=" + message
				}
			} else {
				href += "?body=" + message
			}
		}

		return this.$q.when(href)
	}

	getPhone(person) {
		let phone = _.get(person, "phone", null)

		if (!_.isEmpty(phone) && !(phone instanceof Telephone)) {
			try {
				phone = new Telephone(phone)
			} catch (e) {
				phone = null
			}
		}

		return this.$q.when(phone)
	}

	/**
	 * Gets the url to attach to the end of the text message
	 * @param  {Function|String} url     The url function or string to attach
	 * @param  {Person}          person The person the url is intended for
	 * @return {Promise}
	 */
	getUrl(url, person) {
		let x = null

		if (_.isFunction(url)) {
			let options = {
				sent_via: "sms",
			}

			if (person) {
				options.person = person
			}

			x = url(options)
		} else if (_.isString(url)) {
			x = url
		}

		return this.$q.when(x)
	}

	/**
	 * Gets the sms message text by opening up a modal form if needed
	 * @param  {Function|String} message The text message function or string to send
	 * @param  {Person}          person The person that this message is intended for
	 * @param  {Boolean}         force   Force the modal popup if needed
	 * @return {Promise}
	 */
	getMessage(message, person, force = false) {
		let promise, options

		if (typeof message === "function") {
			if (person) {
				options.person = person
			}

			message = message(options)
		}

		if (force !== true) {
			promise = this.$q.when(message)
		} else {
			promise = this.$popup.textarea(
				"message",
				message,
				"What is the message you would like to send?"
			)
		}

		return promise.then(function (x) {
			return _.isString(x) ? x : _.get(x, "message", null)
		})
	}
}

export const key = "$sms"
export const inject = null
export const fn = SmsService
