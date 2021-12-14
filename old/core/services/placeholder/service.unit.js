/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false, spyOn:false */
describe("$placeholder", function () {
	"use strict";

	var $placeholder;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$placeholder = $injector.get("$placeholder");
		});
	});

	beforeEach(function () {
		spyOn(console, "warn");
	});

	it("should be defined", function () {
		expect($placeholder).toBeDefined();
	});

	it("should replace a placeholder in a string", function () {
		var str = $placeholder.parse("Hello [First Name] [Last Name]", {
			"first-name": "Tyler",
			"last-name": "Arbon",
		});

		expect(str).toEqual("Hello Tyler Arbon");
	});

	it("should replace a placeholder using a value that was set earlier as an object", function () {
		$placeholder.set({
			"first-name": "Tyler",
		});

		var str = $placeholder.parse("Hello [First Name]");

		expect(str).toEqual("Hello Tyler");
	});

	it("should replace a complex placeholder", function () {
		var str = $placeholder.parse("Hello [my very very complex placeholder]", {
			"my-very-very-complex-placeholder": "World",
		});

		expect(str).toEqual("Hello World");
	});

	it("should replace a placeholder with a function result", function () {
		var str = $placeholder.parse("Hello [func]", {
			"func": function () {
				return "World";
			},
		});

		expect(str).toEqual("Hello World");
	});

	it("should log a warning when it misses a placeholder", function () {
		$placeholder.parse("Hello [First Name] [Last Name]", {
			"first-name": "Tyler",
		});

		expect(console.warn).toHaveBeenCalled();
	});

	it("should not attempt to parse a non string value", function () {
		var str = $placeholder.parse(null, {
			"first-name": "Tyler",
		});

		expect(str).toEqual(null);
	});
});
