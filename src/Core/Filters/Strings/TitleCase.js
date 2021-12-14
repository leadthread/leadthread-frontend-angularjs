import _ from "lodash"

export const key = "titleCase"

export const fn = () => {
	function toTitleCase(str) {
		str = str.replace(/[-_]/g, " ")
		str = str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		})
		str = str.replace(/\s?(The|And|But|Of|Or)\s/g, function (txt) {
			return txt.toLowerCase()
		})
		return str.charAt(0).toUpperCase() + str.substr(1)
	}

	return function (input) {
		if (_.isString(input)) {
			return toTitleCase(input)
		} else {
			return input
		}
	}
}
