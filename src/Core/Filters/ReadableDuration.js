export const key = "readableDurationFromDays"

export const fn = () => {
	return function (input) {
		if (input > 0) {
			if (input % 365 === 0) {
				return input / 365 + " years (" + input + " days)"
			}

			if (input % 30 === 0) {
				return input / 30 + " months (" + input + " days)"
			}

			if (input % 7 === 0) {
				return input / 7 + " weeks (" + input + " days)"
			}
		}

		return input + " days"
	}
}
