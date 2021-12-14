/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false, $:false */
describe("Directive \"footer\"", function () {
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
		var element = $compile("<div footer></div>")($rootScope)
		$rootScope.$digest()
		var year = new Date().getFullYear()
		expect(element.html()).toContain("Yaptive © " + year)
	})
})
