/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("Accordion Category directive", function () {
	var $compile, $rootScope, $httpBackend

	// Load the myApp module, which contains the directive
	beforeEach(module("lt.app"))

	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function (_$compile_, _$rootScope_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	beforeEach(inject(function ($injector) {
		$httpBackend = $injector.get("$httpBackend")
	}))

	it("constructs directive", function () {
		$httpBackend
			.whenGET(/http:\/\/localhost:9736\/api\/v1\/files\/*?/)
			.respond({
				data: [
					{
						id: 1,
						fingerprint: "aaaaaaaaaaaaaaaaaa",
					},
				],
			})
		$compile(
			"<categories-directive step='1' cat='auto' prompt='\"hello there\"' option='{chosen:[]}'></categories-directive>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()

		$httpBackend.flush()
	})
})
