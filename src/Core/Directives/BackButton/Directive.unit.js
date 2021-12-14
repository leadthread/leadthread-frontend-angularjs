/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false, $:false */
describe("Directive \"backButton\"", function () {
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
		var element = $compile("<div back-button=\"Test\"></div>")($rootScope)
		$rootScope.$digest()
		expect(element.html()).toContain(">Back</span>")
		expect(element.html()).not.toContain(
			"class=\"icon-chevron-left ng-scope\"></span>"
		)
	})

	it("can be created with the icon", function () {
		// Compile a piece of HTML containing the directive
		var element = $compile("<div back-button=\"Test\" icon=\"true\"></div>")(
			$rootScope
		)
		$rootScope.$digest()
		expect(element.html()).not.toContain(">Back</span>")
		expect(element.html()).toContain(
			"class=\"icon-chevron-left ng-scope\"></span>"
		)
	})
})
