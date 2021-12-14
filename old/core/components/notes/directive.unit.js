/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("notes directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		var element = $compile("<notes-directive notes='[1,2,4,3]' user='{id:1, first_name:\"daniel\", last_name:\"avelares\"}' notable-id='1' notable-type='user'></notes-directive>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("button:first").click();
		$rootScope.$apply();
		$(".popup").find("textarea").val("newVal");
		$rootScope.$apply();
		$(".popup").find("*").click();
		$("body").find("[notes-directive]").first().remove();
		$rootScope.$apply();
	});
});