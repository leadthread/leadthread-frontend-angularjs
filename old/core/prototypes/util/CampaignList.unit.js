/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("CampaignList Spec", function () {
	"use strict";

	var CampaignList, Campaign;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			CampaignList = $injector.get("CampaignList");
			Campaign = $injector.get("Campaign");
		});
	});

	it("Check if CampaignList factory is defined", function () {
		expect(CampaignList).toBeDefined();
	});

	it("can be created", function () {
		var obj = new CampaignList(new Campaign({"name": "apple", "order": 2, "type": "thank"}), new Campaign({"name": "orange", "order": 1, "type": "prompt"}), new Campaign({"name": "cherry", "order": 0, "type": "intro"}));
		expect(obj.length).toEqual(3);
	});

	it("throws an error for non Campaigns", function () {
		expect(function () {
			new CampaignList([{"name": "apple", "order": 0}]);
		}).toThrow("argument #1 is invalid");
	});
});
