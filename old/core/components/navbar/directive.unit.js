/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("navbar directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", inject(function ($state) {
		var element = $compile("<navbar-directive companies='[{id:1, name:\"company co.\"},{id:3, name:\"company co.\"},{id:2, name:\"company co.\"}]' selected='{id:3, name:\"company co.\"}' window-width='722'></navbar-directive>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("*").click();
		$("body").find("[navbar-directive]").first().remove();
		$rootScope.$apply();
	}));
});