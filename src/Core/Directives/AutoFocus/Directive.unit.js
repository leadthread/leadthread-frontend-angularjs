/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("autoFocus directive", function () {
	var $compile, $rootScope

	beforeEach(module("lt.app"))

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	it("constructs directive", function () {
		$compile("<div auto-focus></div>")($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
	})
})
