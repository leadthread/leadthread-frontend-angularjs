/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("SectionList Spec", function () {
	"use strict";

	var SectionList, Section;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			SectionList = $injector.get("SectionList");
			Section = $injector.get("Section");
		});
	});

	it("Check if SectionList factory is defined", function () {
		expect(SectionList).toBeDefined();
	});

	it("can be created", function () {
		var obj = new SectionList(new Section({"name": "apple", "order": 2}), new Section({"name": "orange", "order": 1}), new Section({"name": "cherry", "order": 0}));
		expect(obj.length).toEqual(3);
	});

	it("throws an error for non Section's", function () {
		expect(function () {
			new SectionList([{"name": "apple", "order": 0}]);
		}).toThrow("argument #1 is invalid");
	});
});
