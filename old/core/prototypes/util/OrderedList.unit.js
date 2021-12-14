/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("OrderedList Spec", function () {
	"use strict";

	var OrderedList;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			OrderedList = $injector.get("OrderedList");
		});
	});

	it("Check if OrderedList factory is defined", function () {
		expect(OrderedList).toBeDefined();
	});

	it("can be created", function () {
		var list = new OrderedList({"name": "apple", "order": 2}, {"name": "orange", "order": 1}, {"name": "cherry", "order": 0});
		expect(list.length).toEqual(3);
	});

	it("reorders itself on init", function () {
		var list = new OrderedList({"name": "apple", "order": 2}, {"name": "orange", "order": 1}, {"name": "cherry", "order": 0});
		_.forEach(list, function (item, index) {
			expect(item.order).toEqual(index);
		});
		expect(list.length).toEqual(3);
	});

	it("reorders itself on push", function () {
		var list = new OrderedList();
		list.push({"name": "apple", "order": 2}, {"name": "orange", "order": 1}, {"name": "cherry", "order": 0});
		_.forEach(list, function (item, index) {
			expect(item.order).toEqual(index);
		});
		expect(list.length).toEqual(3);
	});

	it("throws an error for non objects", function () {
		expect(function () {
			var list = new OrderedList({"name": "apple", "order": 2}, "It should fail here", {"name": "cherry", "order": 0});
		}).toThrow("argument #2 is invalid");
	});
});
