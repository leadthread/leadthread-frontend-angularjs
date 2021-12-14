/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("formFile directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		$compile("<div form-file='{}' type='video' url='https://www.youtube.com/watch?v=5pFX2P7JLwA'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("test images", function () {
		$compile("<div form-file='{}' type='image'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("runs clickUloader function", function () {
		var element = $compile("<div form-file='{}' type='image'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("uploader-clicker").click();
		$("body").find("[form-file]").first().remove();
		$rootScope.$apply();
	});
});