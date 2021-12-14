/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sectionImage directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		$compile("<div section-image='{}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("with image as model", inject(function ($httpBackend) {
		$httpBackend.whenGET(/http:\/\/localhost:9736\/api\/v1\/*/)
			.respond({data:[{id:2}]});
		var image = {
			id:1,
			type:"image",
			file_id: 1
		};

		$compile("<div section-image="+JSON.stringify(image)+"></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
		$httpBackend.flush();
	}));
});