import moment from "moment"

export const key = "readableTime"

export const fn = () => {
	return function (input) {
		return moment(input, "HH:mm:ssZZ").format("hh:mm A")
	}
}
