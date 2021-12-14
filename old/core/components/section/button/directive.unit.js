/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sectionButton directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));
	
	beforeEach(function () {
		$("body").html("");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("constructs directive", function () {
		var element = $compile("<div section-button='{}' options='{link:{id:1}}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();
	});

	it("click link", function () {
		var model = {
			url:"#",
			type:"url",
		};
		var element = $compile("<div section-button="+JSON.stringify(model)+" options='{link:{id:1}}'></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("a:first").click();
		$rootScope.$apply();
		$("body").find("[section-button]").first().remove();
		$rootScope.$apply();

	});

	it("click call", inject(function ($httpBackend) {
		$httpBackend.whenPOST("/links/increment-action-count")
			.respond({data:"#"});
		var model = {
			phone:5555555,
			type:"tel",
		};
		var options = {
			owner: {
				phone: 5555555555,
			},
			link: {
				id:1
			}
		};
		var element = $compile("<div section-button="+JSON.stringify(model)+" options="+JSON.stringify(options)+"></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$rootScope.$apply();
		$("[section-button] a.call").first().click();
		$("body").find("[section-button]").first().remove();
		$rootScope.$apply();
		$httpBackend.flush();
	}));

	it("click nav", function () {
		var model = {
			type:"nav",
		};
		var options = {
			link: {
				id:1
			}
		};
		var element = $compile("<div section-button="+JSON.stringify(model)+" options="+JSON.stringify(options)+"></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("div").click();
		$rootScope.$apply();
		$("body").find("[section-button]").first().remove();
		$rootScope.$apply();
	});

	it("click text", function () {
		var model = {
			phone: 5555555555,
			type:"sms",
			button_icon:"earphone"
		};
		var options = {
			owner: {
				phone: "5555555555",
			},
			link: {
				id:1
			}
		};
		var element = $compile("<div section-button="+JSON.stringify(model)+" options="+JSON.stringify(options)+"></div>")($rootScope);
		$rootScope.$apply();
		$rootScope.$digest();

		$("body").append(element);
		$(element).find("div").click();
		$rootScope.$apply();
		$("body").find("[section-button]").first().remove();
		$rootScope.$apply();
	});
});