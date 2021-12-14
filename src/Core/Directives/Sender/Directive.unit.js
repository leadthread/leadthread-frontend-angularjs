/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sender directive", function () {
	var $compile, $rootScope

	beforeEach(module("lt.app"))

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	it("constructs directive", function () {
		var contact = [
			{
				key: "first",
				sent: true,
			},
			{
				key: "sec",
				sent: false,
			},
		]
		$rootScope.contact = contact
		$compile(
			"<div sender contacts='contact' options='{}' type='Customer'></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
	})
})
