/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("userlist directive", function () {
	var $compile, $rootScope

	beforeEach(module("lt.app"))

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	it("constructs directive", inject(function ($stateParams, $httpBackend) {
		var users = []
		$httpBackend
			.whenGET("http://localhost:9736/api/v1/companies/1/users")
			.respond({ data: users })
		$stateParams.companyId = 1
		$compile("<userlist-directive ></userlist-directive>")($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
		$httpBackend.flush()
	}))
})
