/* global describe:false, jasmine:false, afterEach:false, beforeEach:false, module:false, inject:false, it:false, expect:false, spyOn:false */
describe("BuilderController", function () {
	"use strict";

	var $company, $httpBackend, $controller, $q, $campaignDb, CampaignFactory, $auth, CustomerExperienceCampaignForm, WarmIntroCampaignForm;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$company_, _$controller_, _$q_, _$campaignDb_, _CampaignFactory_, _$auth_, _CustomerExperienceCampaignForm_, _WarmIntroCampaignForm_, _$httpBackend_) {
		$controller = _$controller_;
		$q = _$q_;
		$campaignDb = _$campaignDb_;
		CampaignFactory = _CampaignFactory_;
		$auth = _$auth_;
		CustomerExperienceCampaignForm = _CustomerExperienceCampaignForm_;
		WarmIntroCampaignForm = _WarmIntroCampaignForm_;
		$httpBackend = _$httpBackend_;
		$company = _$company_;
	}));

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	var getCampaign = function (type) {
		var campaign = CampaignFactory.create({type: type});
		return campaign.load();
	};

	var setup = function () {
		$company.setCompany({id: 1});

		$httpBackend.whenGET("http://localhost:9736/api/v1/companies/1/logo")
			.respond({data: [{id:1}]});

		$httpBackend.whenGET("http://localhost:9736/api/v1/companies/1/logo/1")
			.respond({data: {id:1}});

		$httpBackend.whenGET("http://localhost:9736/api/v1/users/1/companies")
			.respond({data: [{id:1}]});

		$httpBackend.whenGET("http://localhost:9736/api/v1/users/1/companies/1")
			.respond({data: {id:1}});

		spyOn($company, "getCompany").and.returnValue($q.when({id:1}));
		spyOn($auth, "getUser").and.returnValue({id: 1, first_name: "Tyler", last_name: "Arbon"});
	};

	it("should load up a customer-experience campaign", inject(function ($rootScope) {
		setup();
		var company = {data: {data: {name: "Blah"}}};
		var $scope = $rootScope.$new();
		spyOn($campaignDb, "load").and.returnValue($q.when(getCampaign("customer-experience")));
		var $stateParams = {
			campaignId: 1,
			campaignType: "customer-experience",
			companyId: 1,
		};

		var controller = $controller("BuilderController", { $scope: $scope, company: company, $stateParams: $stateParams });
		expect(controller).toBeDefined();
		
		$httpBackend.flush();
		$rootScope.$apply();

		expect($scope.cf).toEqual(jasmine.any(CustomerExperienceCampaignForm));
	}));

	it("should load up a warm-intro campaign", inject(function ($rootScope) {
		setup();
		var company = {data: {data: {name: "Blah"}}};
		var $scope = $rootScope.$new();
		spyOn($campaignDb, "load").and.returnValue($q.when(getCampaign("warm-intro")));
		var $stateParams = {
			campaignId: 1,
			campaignType: "warm-intro",
			companyId: 1,
		};
		var controller = $controller("BuilderController", { $scope: $scope, company: company, $stateParams: $stateParams });
		expect(controller).toBeDefined();

		$httpBackend.flush();
		$rootScope.$apply();

		expect($scope.cf).toEqual(jasmine.any(WarmIntroCampaignForm));
	}));
});