import moment from "moment"

export const key = "readableDate"

export const fn = () => {
	return function (input) {
		return moment(input).calendar(moment(), {
			sameElse: "MM/DD/YYYY h:mm:ss A",
		})
	}
}
