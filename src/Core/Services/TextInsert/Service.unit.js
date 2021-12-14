/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("$textInsert service", function () {
	var $textInsert

	beforeEach(function () {
		module("lt.app")
		inject(function ($injector) {
			$textInsert = $injector.get("$textInsert")
		})
	})

	afterEach(function () {})

	it("call insert function", function () {
		var textElem = document.createElement("div")
		textElem.value = "This is my text"
		$textInsert.insert(textElem, "Say this")
	})

	it("call insert function without element", function () {
		$textInsert.insert(null, "Say this")
	})
})
