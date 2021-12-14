/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("placeholderInsert directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		var element = $compile("<div placeholder-insert placeholders='{this:\"that\"}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("*").click();
		$("body").find("[placeholder-insert]").first().remove();
		$rootScope.$apply();

	});
});