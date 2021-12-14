import a2a from "a2a"
import _ from "lodash"

import SectionController from "../Controller"

export default class Controller extends SectionController {
	//Bindings
	model
	options

	//Properties
	message
	urlForButtons
	urlForSms
	urlForCopyPaste
	copyPaste
	lock

	$onInit() {
		this.run()
	}

	static $inject = [
		"$q",
		"$device",
		"$timeout",
		"$popup",
		"$http",
		"$notification",
		"$sms",
		"$rootScope",
		"EventService",
		"ContactService",
	]
	constructor(
		$q,
		$device,
		$timeout,
		$popup,
		$http,
		$notification,
		$sms,
		$rootScope,
		EventService,
		ContactService
	) {
		super()
		this.options = {}
		this.model = {}
		this.lock = "Loading"
	}

	run = () => {
		let self = this

		// Values
		self.message = ""
		self.urlForButtons = ""
		self.urlForSms = ""
		self.urlForCopyPaste = ""
		self.copyPaste = ""
		self.lock = "Loading"

		if (!this.options.contact) {
			return this.contactForm().then((link) => {
				console.log(link)
				window.location.href = link.long_url
			})
		}

		return self
			.getSocialRequirements()
			.then(function (resp) {
				var m = _.get(resp, "message", ""),
					ufb = _.get(resp, "urlForButtons", ""),
					ufcp = _.get(resp, "urlForCopyPaste", ""),
					ufs = _.get(resp, "urlForSms", "")

				self.message = m
				self.urlForButtons = ufb
				self.urlForSms = ufs
				self.urlForCopyPaste = ufcp
				self.copyPaste = _([m, ufcp]).compact().join(" ")

				return self.a2aInit().then(self.unlock)
			})
			.catch(function (reason) {
				self.unlock()
				self.$notification.error("Error", reason)
				throw reason
			})
	}

	/**
	 * Unlocks the page
	 */
	unlock = () => {
		this.lock = null
	}

	/**
	 * Mark the current link as sent then create a new link to use
	 * @param  string  sent_via The channel that the link was sent on
	 * @return promise          A promise containing the new url
	 */
	onSend = (sent_via) => {
		let y = this.EventService.record(this.options.link, "sent_" + sent_via)
		let x = this.$http.post("/api/v1/links/sent-via", {
			long_url: this.urlForButtons,
			sent_via: sent_via,
		})
		x.then(this.run)
		return y
	}

	getUrl(sent_via) {
		let self = this
		return self.$q
			.when(
				_.isFunction(self.options.getUrlFn)
					? self.options.getUrlFn({ sent_via: sent_via })
					: {}
			)
			.then((x) => {
				return x.long_url
			})
	}

	getMessage() {
		let self = this
		return self.$q.when(
			_.isFunction(self.options.getMsgFn) ? self.options.getMsgFn() : ""
		)
	}

	/**
	 * Builds the social requirements
	 */
	getSocialRequirements() {
		let self = this
		return self.$q
			.all({
				urlForButtons: self.getUrl(null),
				urlForCopyPaste: self.getUrl("copy_paste"),
				message: self.getMessage(),
			})
			.then(function (x) {
				let promises = _.merge(x, {
					urlForSms: self.$sms.getSmsHref(x.message, x.urlForButtons),
				})
				return self.$q.all(promises)
			})
	}

	onSmsClick = () => {
		let url = this.urlForSms
		this.onSend("sms").then(() => {
			location.href = url
		})
	}

	goNext() {
		this.$rootScope.$broadcast("SiteNext")
	}

	goPrev() {
		this.$rootScope.$broadcast("SitePrev")
	}

	/*==================================
		=            Add to any            =
		==================================*/

	/**
	 * Binds "Add To Any" to the DOM
	 * @param  object  a2a_config Add To Any configuration options
	 * @return promise            Promise containing the a2a instance
	 */
	a2aInit = (a2a_config = {}) => {
		let self = this
		if (typeof a2a !== "undefined") {
			return self.$timeout(() => {
				// Setup AddToAny "onShare" callback function
				a2a_config = a2a_config || {}
				a2a_config.callbacks = a2a_config.callbacks || []
				a2a_config.callbacks.push()

				return a2a.init("page", {
					target: ".a2a_init",
					show_title: true,
					num_services: 999,
					templates: {
						twitter: "${title} ${link}",
						email: {
							subject: "${title}",
							body: "${title}\n${link}",
						},
					},
					callbacks: [
						{
							share: self.a2aOnShare,
						},
					],
				})
			}, 1)
		} else {
			return self.$q.reject("a2a is undefined")
		}
	}

	/**
	 * Called when a user clicks on an "Add To Any" share option
	 * @param  object share_data Data containing information for which button they clicked
	 * @return object            Modified version of "share_data"
	 */
	a2aOnShare = (share_data) => {
		let cancel = false
		let sent_via = share_data.node.a2a.safename
		let url = share_data.url
		let title = share_data.title

		// Mark it as sent and get a new url ready
		this.onSend(sent_via)

		// Cancel share if the request failed
		if (cancel) {
			return _.merge(share_data, {
				stop: true,
			})
		}

		// Modify the share by returning an object with
		// "url" and "title" properties containing the new URL and title
		return _.merge(share_data, {
			url: url,
			title: title,
		})
	}

	/**
	 * Opens the "Add To Any" menu that contains other sharing options
	 * @param  object e The click event
	 * @return void
	 */
	a2aShowMenu(e) {
		if (typeof a2a !== "undefined") {
			e.preventDefault()
			a2a.show_full()
		}
	}

	/*=====  End of Add to any  ======*/
}
