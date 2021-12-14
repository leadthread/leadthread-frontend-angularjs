/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("PageList Spec", function () {
	"use strict";

	var PageList, PageFactory;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			PageList = $injector.get("PageList");
			PageFactory = $injector.get("PageFactory");
		});
	});

	it("Check if PageList factory is defined", function () {
		expect(PageList).toBeDefined();
	});

	it("can be created", function () {
		var obj0 = new PageFactory({"name": "apple", "order": 2, "type": "thank"});
		var obj1 = new PageFactory({"name": "orange", "order": 1, "type": "prompt"});
		var obj2 = new PageFactory({"name": "cherry", "order": 0, "type": "intro"});
		var obj = new PageList(obj0, obj1, obj2);
		expect(obj.length).toEqual(3);
	});

	it("throws an error for non Pages", function () {
		expect(function () {
			new PageList([{"name": "apple", "order": 0}]);
		}).toThrow("argument #1 is invalid");
	});
});
