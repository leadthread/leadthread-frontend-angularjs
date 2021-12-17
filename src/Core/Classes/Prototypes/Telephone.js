import _ from "lodash"
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber"

const phoneUtil = PhoneNumberUtil.getInstance()

export class Telephone {
	country
	number

	constructor(number, country = "US") {
		this.country = country
		this.setNumber(number)
	}

	setNumber(number) {
		if (_.isString(number) && number.length > 0) {
			this.number = number

			if (this.filter().length < 10) {
				console.warn(
					"The phone number must be at least 10 digits in length"
				)
			}
		} else {
			throw "Cannot create an instance of Telephone with an empty phone number"
		}
	}

	filter() {
		var string = this.number
		if (_.isString(string)) {
			string = string.replace(/[^0-9+]/, "")
		}
		return string
	}

	toE164() {
		var string = this.filter()
		if (_.isString(string)) {
			var phoneNumber = phoneUtil.parse(string, this.country)
			string = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164)
		}
		return string
	}

	toNANP() {
		var x = this.toE164()
		var u = x.slice(0, -10)

		if (u === "+1") {
			var y = x.slice(-4)
			var w = x.slice(-7, -4)
			var v = x.slice(-10, -7)
			return "(" + v + ") " + w + "-" + y
		} else {
			return x
		}
	}

	toPretty() {
		return this.toNANP()
	}

	toString() {
		return this.filter()
	}

	valueOf() {
		return this.filter()
	}

	toIphoneSafe() {
		var str = this.filter()
		return str.substr(str.length - 10)
	}
}
