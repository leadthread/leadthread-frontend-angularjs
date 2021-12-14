/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false, jasmine: false */
describe("Directive \"site\"", function () {
	var $compile, $rootScope, Site

	// Load the myApp module, which contains the directive
	beforeEach(module("lt.app"))

	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function (_$compile_, _$rootScope_, _Site_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_
		$rootScope = _$rootScope_
		Site = _Site_
	}))

	// it("fails when using a non instance of Site", function () {
	// 	expect(function () {
	// 		// Compile a piece of HTML containing the directive
	// 		$compile("<div site></div>")($rootScope);
	// 		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
	// 		$rootScope.$digest();
	// 	}).toThrow("Not a Site");
	// });

	it("loads the Site", function () {
		$rootScope.site = new Site()
		// Compile a piece of HTML containing the directive
		$compile("<div site=\"site\"></div>")($rootScope)
		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
		$rootScope.$digest()
	})

	// it("fails when using a non instance of Site", function () {
	// 	expect(function () {
	// 		// Compile a piece of HTML containing the directive
	// 		var element = $compile("<div site></div>")($rootScope);
	// 		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
	// 		$rootScope.$digest();
	// 	}).toThrow("Not a Site");
	// 	// Check that the compiled element contains the templated content
	// 	expect(element.html()).toContain("lidless, wreathed in flame, 2 times");
	// });
})
