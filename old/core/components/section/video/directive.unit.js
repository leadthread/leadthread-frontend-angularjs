/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sectionVideo directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", inject(function ($httpBackend) {
		$httpBackend.whenGET("http://localhost:9736/api/v1/sections/1/videos")
			.respond({data:[{id: 1, video_id:1, video_url:"https://www.youtube.com/watch?v=hRAFPdDppzs"}]});
		
		$httpBackend.whenGET("http://localhost:9736/api/v1/sections/1/videos/1")
			.respond({data:{id: 1, video_id:1, video_url:"https://www.youtube.com/watch?v=hRAFPdDppzs"}});
		
		$compile("<div section-video='{id:1, type:\"video\"}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
		
		$httpBackend.flush();
	}));
});