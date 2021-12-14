/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sectionCollect directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		var model = {};
		var options = {};
		var element = $compile("<div section-collect="+JSON.stringify(model)+" options="+JSON.stringify(options)+"></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
		$("body").append(element);
		$(element).find("*").click();
		$rootScope.$apply();
	});
});