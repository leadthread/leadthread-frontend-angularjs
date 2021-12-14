/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("contactSelector directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		$compile("<div contact-selector='dd' onNewContact='function () {return true;}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("calls tryAgain function", function () {
		var element = $compile("<div contact-selector='dd' onNewContact='function () {return true;}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("input").first().val("Name String");
		$(element).find(".btn.btn-primary").first().click();
		$rootScope.$apply();
		$(".popup input[name=phone]").val("12345672980");
		$(".popup input[name=first_name]").val("Daniel");
		$(".popup input[name=last_name]").val("Avelares");
		$(".popup input[name=email]").val("danielavelares@gmail.com");
		$rootScope.$apply();
		$(".popup button[type=submit]").click();
		$rootScope.$apply();

		$rootScope.$digest();
		$("body").find("[contact-selector]").first().remove();
		$rootScope.$apply();
	});
});