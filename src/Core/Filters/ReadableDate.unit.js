/* global moment:false, describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("readableDate filter", function () {
	var $filter

	beforeEach(function () {
		module("lt.app")

		inject(function (_$filter_) {
			$filter = _$filter_
		})
	})

	it("convert date to \"Today\"", function () {
		var date = moment().toISOString()
		var result = $filter("readableDate")(date)
		expect(result).toEqual("Today")
	})

	it("convert date to \"Tomorrow\"", function () {
		var date = moment().add(1, "day").toISOString()
		var result = $filter("readableDate")(date)
		expect(result).toEqual("Tomorrow")
	})

	it("convert date to \"Yesterday\"", function () {
		var date = moment().subtract(1, "day").toISOString()
		var result = $filter("readableDate")(date)
		expect(result).toEqual("Yesterday")
	})

	it("convert date to \"2 days ago\"", function () {
		var date = moment().subtract(2, "day").toISOString()
		var result = $filter("readableDate")(date)
		expect(result).toEqual("2 days ago")
	})

	it("convert date to \"3 more days\"", function () {
		var date = moment().add(3, "day").toISOString()
		var result = $filter("readableDate")(date)
		expect(result).toEqual("3 more days")
	})
})
