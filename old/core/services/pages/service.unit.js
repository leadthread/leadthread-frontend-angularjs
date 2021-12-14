/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("$pages Spec", function () {
	"use strict";

	var $pages;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$pages = $injector.get("$pages");
		});
	});

	it("should be defined", function () {
		expect($pages).toBeDefined();
	});

	it("should return an array when using all", function () {
		var pages = $pages.all();
		expect(_.isArray(pages)).toEqual(true);
	});
});
