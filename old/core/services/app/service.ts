namespace lt.services {
	
	export class AppService {
        protected _COMPANY_ID: number;
        
        static $inject = ["$http"];
		constructor(protected $http: ng.IHttpService) {}

        get COMPANY_ID(): number {
            return this._COMPANY_ID;
        }

        set COMPANY_ID(x: number) {
            this._COMPANY_ID = x;
            this.$http.defaults.headers.common['Company'] = x;
        }
	}

	angular.module("lt.core").service("$app", AppService);
}
