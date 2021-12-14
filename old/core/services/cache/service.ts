declare var moment: any

namespace lt {
	export class CacheService implements ICacheService {
		/**
		 * Store running promises by cache key
		 */
		protected promises: {
			[key: string]: ng.IPromise<any>
		};

		static $inject = ["$localStorage", "$sessionStorage", "$interval", "$q"];
		constructor(protected $localStorage: IStorageService, protected $sessionStorage: IStorageService, protected $interval: ng.IIntervalService, protected $q: ng.IQService) {
			this.promises = {};
			this.$interval(() => {
				_.forEach([false, true], (x) => {
					var storage = this.getStorage(x),
						items = storage.getAllStoredItems(),
						timeDiff = 0;

					for (var key in items) {
						var cache = storage.get(key);
						if (_.isObject(cache) && !_.isEmpty(cache.expires_at)) {
							var a = moment(cache.expires_at);
							var b = moment();
							timeDiff = a.diff(b);
							if (timeDiff < 0) {
								storage.remove(key);
							}
						}
					}
				});
			}, 60000);
		}
		
		remember(key: string, minutes: number, callback: Function, useLocalStorage: boolean = false) {
			var cache      = this.getStorage(useLocalStorage).get(key),
				value      = cache === null ? null : cache.value,
				expires_at = cache === null ? null : cache.expires_at,
				timeDiff   = 0;

			if (!_.isEmpty(expires_at)) {
				var a = moment(expires_at);
				var b = moment();
				timeDiff = a.diff(b);
			}

			var isNoLongerValid = (value === null || _.isEmpty(expires_at) || timeDiff < 0);

			if (isNoLongerValid) {
				if (this.promises[key]) {
					return this.promises[key];
				} else {
					var x = this.$q.when(callback());

					// Store the result in local or session storage!
					x.then((resp) => {
						if (_.isInteger(minutes) && minutes > 0) {
							var expires_at = moment().add(minutes, "minutes");
							this.getStorage(useLocalStorage).set(key, {value: resp, expires_at: expires_at});
						}
						return resp;
					});

					// Delete the promise from the 'running' this.promises object
					x.finally(() => {
						delete this.promises[key];
					});

					// Add the promise to the 'running' promises object
					this.promises[key] = x;
					return x;
				}
			} else {
				return this.$q.when(value);
			}
		};

		get(key: string, useLocalStorage: boolean = false) {
			var data = this.getStorage(useLocalStorage).get(key);
			if (data === null) {
				return null;
			}
			return data.value;
		};

		has(key: string, useLocalStorage: boolean = false) {
			if (this.getStorage(useLocalStorage).get(key) === null) {
				return false;
			}
			return true;
		};

		forget(key: string, useLocalStorage: boolean = false) {
			this.getStorage(useLocalStorage).remove(key);
		};

		forgetWhere(partialKey: string, useLocalStorage: boolean = false) {
			this.getStorage(useLocalStorage).removeWhere(partialKey);
		};

		getStorage(useLocalStorage: boolean): IStorageService {
			return useLocalStorage ? this.$localStorage : this.$sessionStorage;
		};
	}

	angular.module("lt.core").service("$cache", CacheService);
}
