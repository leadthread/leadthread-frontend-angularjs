/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("Prompt", function () {
	"use strict";

	var Prompt;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			Prompt = $injector.get("Prompt");
		});
	});

	it("Creates a Campaign", function () {
		var prompt = new Prompt();
		var isPrompt = prompt instanceof Prompt;
		expect(isPrompt).toEqual(true);
	});

	it("Tests valueOf function", function () {
		var prompt = new Prompt("prompt", 2, undefined, 0);
		var res = prompt.valueOf();
		expect(res).toEqual({
			prompt:"prompt",
			file_id:2,
			order: 0
		});
	});
});
