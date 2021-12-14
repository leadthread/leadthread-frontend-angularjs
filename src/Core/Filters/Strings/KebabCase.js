import _ from "lodash"

export const key = "kebabCase"

export const fn = () => {
	return function (input) {
		if (_.isString(input)) {
			return input.replace(/[\s_]/g, "-").toLowerCase()
		} else {
			return input
		}
	}
}
