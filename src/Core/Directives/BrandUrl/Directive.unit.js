/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false, $:false */
describe("Directive \"brandUrl\"", function () {
	var $compile, $rootScope

	// Load the myApp module, which contains the directive
	beforeEach(module("lt.app"))

	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function (_$compile_, _$rootScope_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	it("can be created", function () {
		// Compile a piece of HTML containing the directive

		$rootScope.obj = { url: "https://google.com" }
		var element = $compile("<div brand-url=\"obj\"></div>")($rootScope)
		$rootScope.$digest()
		expect(element.html()).toContain("Visit us at google.com")
	})
})
