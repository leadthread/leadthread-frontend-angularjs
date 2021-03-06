class AppService {
	_COMPANY_ID

	static $inject = ["$http"]
	constructor($http) {
		this.$http = $http
	}

	get COMPANY_ID() {
		return this._COMPANY_ID
	}

	set COMPANY_ID(x) {
		this._COMPANY_ID = x
		this.$http.defaults.headers.common["Company"] = x
	}
}

export const key = "$app"
export const inject = null
export const fn = AppService
