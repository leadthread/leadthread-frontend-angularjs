/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sectionSocial directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		var options = {
			getUrlFn: function () {
				return true;
			},
			getSocialMsgFn: function () {
				return true;
			}
		};
		var model = {

		};
		var element = $compile("<div section-social="+JSON.stringify(model)+" options="+JSON.stringify(options)+"></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
		$("body").append(element);
		
		$(element).find(".a2a_dd").click();
		$(element).find(".btn").click();
		$rootScope.$apply();

	});
});