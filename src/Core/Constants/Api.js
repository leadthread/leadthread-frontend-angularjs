//For the $api service
export const key = "API"

export const value = {
	host: (function () {
		return location.host ? location.host : "yaptive.local"
	})(),
	port: 80,
	secure: false,
	version: "v1",
}
