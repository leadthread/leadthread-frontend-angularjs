import _ from "lodash"
import { Referral } from "../../../Classes/Models"

import SectionController from "../Controller"

export default class Controller extends SectionController {
	static $inject = [
		"$rootScope",
		"$timeout",
		"$placeholder",
		"$q",
		"$http",
		"$popup",
		"$sms",
		"$notification",
		"$cache",
		"EventService",
	]

	//Bindings
	first
	last

	//Properties
	smsHref

	constructor(
		$rootScope,
		$timeout,
		$placeholder,
		$q,
		$http,
		$popup,
		$sms,
		$notification,
		$cache,
		EventService
	) {
		super()
		this.$rootScope = $rootScope
		this.$timeout = $timeout
		this.$placeholder = $placeholder
		this.$q = $q
		this.$http = $http
		this.$popup = $popup
		this.$sms = $sms
		this.$notification = $notification
		this.$cache = $cache
		this.EventService = EventService
		this.$onInit()
	}

	run = () => {
		if (_.isEmpty(this.model.text)) {
			this.model.text = this.model.type == "nav" ? "Next" : "Click Here"
		}

		this.loadSmsHref()
	}

	getIconClass(icon) {
		if (icon === "earphone") {
			icon = "phone"
		}
		return "icon-" + icon
	}

	getButtonStyle() {
		var style = {
			background: this.model.button_color,
			color: this.model.font_color,
			"border-radius": this.model.button_border_radius,
			border:
				this.model.button_border_width +
				"px solid " +
				this.model.button_border_color,
			"line-height": "125%",
			height: "auto",
		}
		return style
	}

	parse(str) {
		return this.$placeholder.parse(str)
	}

	doRegister() {
		let clickedPromise = this.record("register")
		let link = _.get(this, "options.link")
		let referral = _.get(this, "options.referral")

		referral = this.getPersonFromPopup(referral)

		return this.$q.when(referral).then(
			((referral) => {
				return this.signup(referral, link, this.parse(this.model.text))
			}).then((x) => {
				let message = _.get(
					this,
					"model.success_message",
					"Thank You. We will contact you with more information."
				)
				this.$notification.success(message)
				return x
			})
		)
	}

	doUrl(href) {
		let self = this

		self.record("url").then(function () {
			location.href = self.fixUrl(href)
		})
	}

	doCall() {
		this.record("call").then(() => {
			location.href = "tel:" + this.getPhone()
		})
	}

	doEmail() {
		let email = this.getEmail()
		if (email) {
			this.record("email").then(() => {
				window.location.href = "mailto:" + email
			})
		}
	}

	doSms() {
		if (this.smsHref) {
			this.record("sms").then(() => {
				window.location.href = this.smsHref
			})
		}
	}

	signup = (referral, link, button) => {
		let key = "signup-link-" + link.id

		return this.$cache.remember(key, 1440, () => {
			if (referral instanceof Referral) {
				referral = referral.valueOf()
			}
			return this.$http
				.post("/api/v1/links/" + link.id + "/signup", {
					referral: referral,
					events: _.map(this.EventService.recorded, "id"),
					button: button,
				})
				.then(function (response) {
					return response.data.data
				})
		})
	}

	fixUrl(url) {
		if (_.isString(url)) {
			var idx1 = url.indexOf("http://")
			var idx2 = url.indexOf("https://")
			if (idx1 === -1 && idx2 === -1) {
				url = "http://" + url
			}
		}
		return url
	}

	getPhone() {
		var phoneButton = _.get(this, "model.phone", null)
		var phoneUser = _.get(this, "options.owner.phone", null)
		return phoneButton ? phoneButton : phoneUser
	}

	getEmail() {
		var emailButton = _.get(this, "model.email", null)
		var emailUser = _.get(this, "options.owner.email", null)
		return emailButton ? emailButton : emailUser
	}

	loadSmsHref() {
		let self = this
		if (!self.smsHref) {
			var o = self.options.owner
			if (_.isObject(o) && o.first_name && o.last_name) {
				if (self.getPhone()) {
					o.phone = self.getPhone()
				}
				self.$sms.getSmsHref(null, null, o).then(function (resp) {
					self.smsHref = resp
				})
			} else {
				self.smsHref = "sms:"
			}
		}
	}

	record(type, link = null) {
		link = link || _.get(this, "options.link")
		if (link) {
			return this.EventService.record(link, "clicked_" + type)
		} else {
			return this.$q.reject("Link object not found")
		}
	}

	goNext() {
		this.$rootScope.$emit("SiteNext")
	}

	goPrev() {
		this.$rootScope.$emit("SitePrev")
	}

	getPersonFromPopup(referral, collectCompany = false) {
		let form = []

		form.push({
			type: "input",
			subtype: "text",
			label: "First Name",
			key: "first_name",
			value: _.get(referral, "first_name"),
			required: true,
		})
		form.push({
			type: "input",
			subtype: "text",
			label: "Last Name",
			key: "last_name",
			value: _.get(referral, "last_name"),
			required: true,
		})
		form.push({
			type: "input",
			subtype: "tel",
			label: "Mobile Number",
			key: "phone",
			value: _.get(referral, "phone"),
			required: true,
		})
		form.push({
			type: "input",
			subtype: "email",
			label: "Email",
			key: "email",
			value: _.get(referral, "email"),
			required: true,
		})

		if (collectCompany) {
			form.push({
				type: "input",
				subtype: "text",
				label: "Company(Optional)",
				key: "company",
				value: _.get(referral, "company"),
				required: false,
			})
		}

		return this.$popup.form(form, this.model.text)
	}
}
