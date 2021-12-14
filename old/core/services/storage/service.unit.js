/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("Storage Service", function () {
	"use strict";

	var drivers, $localStorage, $sessionStorage, $proxyStorage;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$localStorage = $injector.get("$localStorage");
			$sessionStorage = $injector.get("$sessionStorage");
			$proxyStorage = $injector.get("$proxyStorage");
			drivers = [$localStorage, $sessionStorage, $proxyStorage];

			eachDriver(function (driver) {
				driver.clear();
			});
		});
	});

	var eachDriver = function (func) {
		_.each(drivers, func);
	};

	it("should be defined", function () {
		eachDriver(function (driver) {
			expect(driver).toBeDefined();
		});
	});

	it("should set and get data", function () {
		eachDriver(function (driver) {
			var y, x = {name: "test"};
			driver.set("test", x);
			y = driver.get("test");
			expect(y).toEqual(x);
		});
	});

	it("should check if it has the data", function () {
		eachDriver(function (driver) {
			var x = {name: "test"};
			expect(driver.has("test")).toEqual(false);
			driver.set("test", x);
			expect(driver.has("test")).toEqual(true);
		});
	});

	it("should remove data", function () {
		eachDriver(function (driver) {
			var x = {name: "test"};
			
			driver.set("test", x);
			expect(driver.has("test")).toEqual(true);

			driver.remove("test");
			expect(driver.has("test")).toEqual(false);
		});
	});

	it("should remove data where key is similar", function () {
		eachDriver(function (driver) {
			var x = {name: "test"};
			
			driver.set("test1", x);
			driver.set("test2", x);
			driver.set("test20", x);
			expect(driver.has("test1")).toEqual(true);
			expect(driver.has("test2")).toEqual(true);
			expect(driver.has("test20")).toEqual(true);

			driver.removeWhere("test2");
			expect(driver.has("test1")).toEqual(true);
			expect(driver.has("test2")).toEqual(false);
			expect(driver.has("test20")).toEqual(false);
		});
	});
});
