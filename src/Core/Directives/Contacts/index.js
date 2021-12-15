export const key = "contacts"

export const inject = ["$q", "$cache", "$api", "$http"]

export const fn = ($q, $cache, $api, $http) => {
	return {
		restrict: "E",
		template: require("./index.html"),
	}
}
