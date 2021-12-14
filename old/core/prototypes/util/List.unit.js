/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("List Spec", function () {
	"use strict";

	var List;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			List = $injector.get("List");
		});
	});

	it("Check if List factory is defined", function () {
		expect(List).toBeDefined();
	});

	it("can be created", function () {
		var obj = new List("apple", "orange", "cherry");
		expect(obj[0]).toEqual("apple");
		expect(obj[1]).toEqual("orange");
		expect(obj[2]).toEqual("cherry");
	});

	it("can push items onto the list", function () {
		var obj = new List("apple", "orange", "cherry");
		obj.push("strawberry");
		expect(obj[3]).toEqual("strawberry");
	});

	it("can clear itself", function () {
		var obj = new List("apple", "orange", "cherry");
		obj.clear();
		expect(obj.length).toEqual(0);
	});
});
