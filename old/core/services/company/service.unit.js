/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false,afterEach:false, spyOn:false */
describe("Company", function () {
	"use strict";

	var $company, $stateParams, $auth, $httpBackend, mockCompany, mockCompany1, mockCompany2, getUserIdSpy, $rootScope;

	beforeEach(function () {
		module('lt.app');

		inject(function ($injector) {
			$stateParams = $injector.get("$stateParams");
			$httpBackend = $injector.get("$httpBackend");
			$auth = $injector.get("$auth");
			$rootScope = $injector.get("$rootScope");
		});

		mockCompany = {
			id:24,
			name:"tester",
			color:"#ff0000",
			logo_id:1,
			url:"",
			logo_background_color: "#ffffff",
			industry: "auto"
		};

		mockCompany1 = {
			id:25,
			name:"My Company Corp.",
			color:"#ff0000",
			logo_id:2,
			url:"",
			logo_background_color: "#ffffff",
			industry: "auto"
		};

		mockCompany2 = {
			id:27,
			name:"Corp inc.",
			color:"#ff0000",
			logo_id:0,
			url:"",
			logo_background_color: "#ffffff",
			industry: "auto"
		};
	});

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("checks getCompany", function () {
		spyOn($auth, "getUserId").and.returnValue(1);
		$httpBackend.whenGET("http://localhost:9736/api/v1/users/1/companies")
			.respond({data: [
				{id: 24}, {id:25}
			]});

		$httpBackend.whenGET("http://localhost:9736/api/v1/users/1/companies/24+25")
			.respond({data: [
				mockCompany, mockCompany1
			]});
		inject(function ($injector) {
			$company = $injector.get("$company");
		});
		$stateParams.companyId = 24;
		$company.getCompany().then(function (resp) {
			expect(resp).toEqual(mockCompany);
		});
		$httpBackend.flush();
	});

	it("checks setCompany", function () {
		spyOn($auth, "getUserId").and.returnValue(1);
		inject(function ($injector) {
			$company = $injector.get("$company");
		});
		$company.setCompany(mockCompany2);
		$company.getCompany().then(function (resp) {
			expect(resp).toEqual(mockCompany2);
		});
	});

	// it("check populated company", function () {
	// 	spyOn($auth, "getUserId").and.returnValue(1);
	// 	$stateParams.companyId = 24;

	// 	$httpBackend.whenGET("http://localhost:9736/api/v1/users/1/companies")
	// 		.respond({data: [
	// 			{id: 24}, {id:25}
	// 		]});

	// 	$httpBackend.whenGET("http://localhost:9736/api/v1/users/1/companies/24+25")
	// 		.respond({data: [
	// 			mockCompany, mockCompany1
	// 		]});


	// 	inject(function ($injector) {
	// 		$company = $injector.get("$company");
	// 	});
	// 	$rootScope.$apply();

	// 	$company.setCompany(mockCompany);

	// 	expect($company.getName()).toEqual(mockCompany.name);
	// 	expect($company.getId()).toEqual(mockCompany.id);
	// 	expect($company.getColor()).toEqual(mockCompany.color);
	// 	expect($company.getLogoId()).toEqual(mockCompany.logo_id);
	// 	expect($company.getUrl()).toEqual(mockCompany.url);
	// 	expect($company.getLogoBackgroundColor()).toEqual(mockCompany.logo_background_color);
	// 	expect($company.getIndustry()).toEqual(mockCompany.industry);

	// 	$company.setCompany(mockCompany1);

	// 	expect($company.getName()).toEqual(mockCompany1.name);
	// 	expect($company.getId()).toEqual(mockCompany1.id);
	// 	expect($company.getColor()).toEqual(mockCompany1.color);
	// 	expect($company.getLogoId()).toEqual(mockCompany1.logo_id);
	// 	expect($company.getUrl()).toEqual(mockCompany1.url);
	// 	expect($company.getLogoBackgroundColor()).toEqual(mockCompany1.logo_background_color);
	// 	expect($company.getIndustry()).toEqual(mockCompany1.industry);
	// 	$httpBackend.flush();
	// });
});
