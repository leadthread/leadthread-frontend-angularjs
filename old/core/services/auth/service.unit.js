/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("$auth", function () {
	"use strict";

	var $auth, $httpBackend, $localStorage, $sessionStorage;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$httpBackend = $injector.get("$httpBackend");
			$auth = $injector.get("$auth");
			$localStorage = $injector.get("$localStorage");
			$sessionStorage = $injector.get("$sessionStorage");
		});
	});

	afterEach(function () {
		$localStorage.clear();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
		$localStorage.clear();
		$sessionStorage.clear();
	});

	function login () {
		$httpBackend.expectPOST("/auth/login")
			.respond({data: {id:1}});

		$httpBackend.expectGET("http://localhost:9736/api/v1/users/1/companies")
			.respond({data: [{id: 1}]});
		
		$httpBackend.expectGET("http://localhost:9736/api/v1/users/1/companies/1")
			.respond({data: {id: 1}});

		$httpBackend.expectGET("http://localhost:9736/api/v1/users/1/roles?company_id=1")
			.respond({data: [{id: 1}]});

		$httpBackend.expectGET("http://localhost:9736/api/v1/users/1/roles/1")
			.respond({data: {id: 1, name: "Admin"}});

		return $auth.login("email", "password");
	}

	it("Check if $auth service is defined", function () {
		expect($auth).toBeDefined();
	});

	it("should fail to login if email and/or password are not strings", inject(function ($rootScope) {
		var firstError;
		var secondError;
		$auth.login().catch(function (reason) {
			firstError = reason;
		});
		$auth.login("email").catch(function (reason) {
			secondError = reason;
		});
		$rootScope.$apply();
		expect(firstError).toEqual("Email is not valid");
		expect(secondError).toEqual("Password is not valid");
	}));

	it("should login and get localStorage data", inject(function ($q, $rootScope) {
		
		login();
		$httpBackend.flush();
		$rootScope.$apply();
		expect($localStorage.has("user")).toEqual(true);
	}));
	
	it("should login with invite code", inject(function ($rootScope) {
		
		var code = "XDFERS";
		
		$httpBackend.expectPOST("/auth/code")
			.respond({data: {"code": {"code": code}, contact: {name: "name", id: 1}}});
		
		$auth.loginWithInviteCode(code);
		$httpBackend.flush();
		$rootScope.$apply();
		
		expect($localStorage.has("code")).toEqual(true);
		expect($localStorage.has("contact")).toEqual(true);
		expect($auth.getContact()).toEqual({name:"name", id: 1});
		expect($auth.getContactId()).toEqual(1);
		expect($auth.getInviteCode()).toEqual({"code":code});
	}));

	it("should login with a link", inject(function ($rootScope) {
		$auth.loginWithLink("link").then(function (resp) {
			expect(resp).toEqual(true);
			expect($localStorage.has("link")).toEqual(true);
		});
		$rootScope.$apply();
	}));

	it("will get link from localStorage", inject(function ($rootScope) {
		
		expect($auth.getLink()).toEqual(null);
		$auth.loginWithLink("link").then(function () {
			expect($auth.getLink()).toEqual("link");
		});
		$rootScope.$apply();
	}));

	it("should logout", inject(function ($q, $rootScope) {
		$httpBackend.whenGET("/auth/logout")
			.respond(true);
		login();
		$httpBackend.flush();
		$rootScope.$apply();
		$auth.logout();
		$httpBackend.flush();
		$rootScope.$apply();
		expect($localStorage.has("user")).toEqual(false);
	}));

	it("should register", inject(function ($rootScope) {
		$httpBackend.whenPOST("/links/register")
			.respond({data: "test"});

		$auth.register("fn", "ln", 545, "e@e.e", "1").then(function (resp) {
			expect(resp).toEqual("test");
		});

		$httpBackend.flush();
		$rootScope.$apply();
	}));

	it("gets the role", inject(function ($rootScope, $stateParams) {
		login();

		$httpBackend.flush();
		$rootScope.$apply();

		expect($auth.getRoles()).toEqual([{role:"Admin", company:1}]);

		$stateParams.companyId = undefined;
		expect($auth.getRole().role).toEqual("Admin");
		$stateParams.companyId = 1;
		expect($auth.getRole().role).toEqual("Admin");
		expect($auth.getRole(1).role).toEqual("Admin");
		expect($auth.hasRole("Admin", 1)).toEqual(true);
	}));
});
