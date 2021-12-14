/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("$cache Spec", function () {
	var $cache

	beforeEach(function () {
		module("lt.app")
		inject(function ($injector) {
			$cache = $injector.get("$cache")
		})
	})

	it("Check if $cache service is defined", function () {
		expect($cache).toBeDefined()
	})

	it("return null if key does not exist", function () {
		expect($cache.get("randomkey")).toBeNull()
	})

	it("should return cached value", inject(function ($q, $rootScope) {
		$cache.remember("value", 10, function () {
			return 1234
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()

		expect($cache.get("value")).toEqual(1234)
	}))

	it("should not cache when minutes is 0", inject(function ($q, $rootScope) {
		$cache.remember("value", 0, function () {
			return 1234
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()

		expect($cache.get("value")).toBeNull()
	}))

	it("should properly check if key exists or not", inject(function (
		$q,
		$rootScope
	) {
		// Should not exist
		expect($cache.has("value")).toEqual(false)

		$cache.remember("value", 10, function () {
			return 1234
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()

		// Should exist
		expect($cache.has("value")).toEqual(true)
	}))

	it("should only cache it once", inject(function ($q, $rootScope) {
		$cache.remember("value", 10, function () {
			return 1234
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()

		$cache.remember("value", 10, function () {
			return 12345
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()

		expect($cache.get("value")).toEqual(1234)
	}))

	it("should forget cache keys properly", inject(function ($q, $rootScope) {
		$cache.remember("value", 10, function () {
			return 1234
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()
		expect($cache.has("value")).toEqual(true)
		$cache.forget("value")
		expect($cache.has("value")).toEqual(false)
	}))

	it("should forget cache keys properly when using a partial key", inject(function (
		$q,
		$rootScope
	) {
		$cache.remember("value", 10, function () {
			return 1234
		})
		// Propagate promise resolution to 'then' functions using $apply().
		$rootScope.$apply()
		expect($cache.has("value")).toEqual(true)
		$cache.forgetWhere("va")
		expect($cache.has("value")).toEqual(false)
	}))
})
