/* global describe:false, jasmine:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("$campaignDb", function () {
	"use strict";

	var $campaignDb, $httpBackend, Campaign, CustomerExperienceCampaign, CustomerExperienceCampaignSite, PageList, IntroPage, ThankYouPage, SectionList, TextSection;

	var mockCampaignResponse = {data: {"id": 1, "name": "Test Campaign", "site_id": 1, "type": "referral"}};
	var mockSiteResponse = {data: {"id": 1, "name": "Test Site", "site_id": 1, "type": "referral"}};
	var mockPageIndexResponse = {data: [{"id": 1}, { "id": 2}]};
	var mockPageBatchResponse = {data: [
		{"id": 1, "name": "Test Page 1", "site_id": 1, "type": "intro"}, 
		{"id": 2, "name": "Test Page 2", "site_id": 1, "type": "thank"}
	]};
	var mockPageOneSectionIndexResponse = {data: [{"id": 1}]};
	var mockPageTwoSectionIndexResponse = {data: [{"id": 2}]};
	var mockSectionOneResponse = {data: {"id": 1, "name": "Test Section #1", "page_id": 1, "type": "text"}};
	var mockSectionTwoResponse = {data: {"id": 2, "name": "Test Section #2", "page_id": 2, "type": "text"}};

	function getNewCampaign () {
		var campaign = new CustomerExperienceCampaign({
			"name": "Test Campaign",
		});

		campaign.site = new CustomerExperienceCampaignSite({
			"name": "Test Campaign Site",
		});

		return campaign;
	}

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$httpBackend = $injector.get("$httpBackend");
			$campaignDb = $injector.get("$campaignDb");
			Campaign = $injector.get("Campaign");
			CustomerExperienceCampaign = $injector.get("CustomerExperienceCampaign");
			CustomerExperienceCampaignSite = $injector.get("CustomerExperienceCampaignSite");
			PageList = $injector.get("PageList");
			IntroPage = $injector.get("IntroPage");
			ThankYouPage = $injector.get("ThankYouPage");
			SectionList = $injector.get("SectionList");
			TextSection = $injector.get("TextSection");
		});
	});

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("Check if $campaignDb service is defined", function () {
		expect($campaignDb).toBeDefined();
	});

	it("Should save a campaign", inject(function ($q, $rootScope) {
		var campaign = getNewCampaign();
		var success = false;


		campaign.load().then(function (campaign) {
			$httpBackend.expectPOST("http://localhost:9736/api/v1/sites")
				.respond({data: campaign.site.valueOf()});

			$httpBackend.expectPOST("http://localhost:9736/api/v1/sites")
				.respond({data: campaign.action_page.site.valueOf()});

			$httpBackend.expectPOST("http://localhost:9736/api/v1/action-pages")
				.respond({data: campaign.action_page.valueOf()});

			$httpBackend.expectPOST("http://localhost:9736/api/v1/campaigns")
				.respond({data: campaign.valueOf()});
	

			var promise = $campaignDb.save(campaign).then(function () {
				success = true;
			});
		});

		$rootScope.$apply();
		$httpBackend.flush();
		expect(success).toEqual(true);
	}));

	it("Should load a campaign", inject(function ($q, $rootScope) {
		$httpBackend.expectGET("http://localhost:9736/api/v1/campaigns/1")
			.respond(mockCampaignResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/sites/1")
			.respond(mockSiteResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/sites/1/pages")
			.respond(mockPageIndexResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/sites/1/pages/1+2")
			.respond(mockPageBatchResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/pages/1/sections")
			.respond(mockPageOneSectionIndexResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/pages/2/sections")
			.respond(mockPageTwoSectionIndexResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/pages/1/sections/1")
			.respond(mockSectionOneResponse);

		$httpBackend.expectGET("http://localhost:9736/api/v1/pages/2/sections/2")
			.respond(mockSectionTwoResponse);

		$campaignDb.load(1, "referral").then(function (campaign) {
			expect(campaign).toEqual(jasmine.any(CustomerExperienceCampaign));
			expect(campaign.site).toEqual(jasmine.any(CustomerExperienceCampaignSite));
			expect(campaign.site.pages).toEqual(jasmine.any(PageList));
			expect(campaign.site.pages[0]).toEqual(jasmine.any(IntroPage));
			expect(campaign.site.pages[0].sections).toEqual(jasmine.any(SectionList));
			expect(campaign.site.pages[0].sections[0]).toEqual(jasmine.any(TextSection));
			expect(campaign.site.pages[1]).toEqual(jasmine.any(ThankYouPage));
			expect(campaign.site.pages[1].sections).toEqual(jasmine.any(SectionList));
			expect(campaign.site.pages[1].sections[0]).toEqual(jasmine.any(TextSection));
		});

		$rootScope.$apply();
		$httpBackend.flush();
	}));

	// it("Should save a campaign", inject(function($q, $rootScope) {
	// 	var campaign = new Campaign();
	// 	$campaignDb.save(campaign);
	// 	$rootScope.$apply();
	// 	$httpBackend.flush();
	// }));
});
