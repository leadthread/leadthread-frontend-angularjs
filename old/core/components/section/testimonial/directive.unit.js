/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sectionTestimonial directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		$compile("<section-testimonial options='{story:{}}'></section-testimonial>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("constructs directive with video", function () {
		var options = {
			story:{
				type:"video",
				id:1
			}
		};
		$rootScope.options = options;
		$compile("<section-testimonial options='options'></section-testimonial>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("constructs directive with image", function () {
		var options = {
			story:{
				type:"image",
				id:1,
				caption:"this is a caption"
			}
		};
		$rootScope.options = options;
		$compile("<section-testimonial options='options'></section-testimonial>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});
});