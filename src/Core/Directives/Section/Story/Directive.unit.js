/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("SectionStory directive", function () {
	var $compile, $rootScope

	beforeEach(module("lt.app"))

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	it("constructs directive as image with file", inject(function (
		$httpBackend
	) {
		$httpBackend
			.whenGET("http://localhost:9736/api/v1/files/1")
			.respond({ data: {} })
		var options = {
			story: {
				type: "image",
				file_id: 1,
			},
		}
		$compile(
			"<div section-story options=" + JSON.stringify(options) + "></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
		$httpBackend.flush()
		$httpBackend.verifyNoOutstandingExpectation()
		$httpBackend.verifyNoOutstandingRequest()
	}))

	it("constructs directive as image without file", inject(function (
		$httpBackend
	) {
		$httpBackend
			.whenGET("http://localhost:9736/api/v1/files/1")
			.respond({ data: {} })
		var options = {
			story: {
				type: "image",
			},
		}
		var model = {
			file_id: 1,
		}
		$compile(
			"<div section-story=" +
				JSON.stringify(model) +
				" options=" +
				JSON.stringify(options) +
				"></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
		$httpBackend.flush()
		$httpBackend.verifyNoOutstandingExpectation()
		$httpBackend.verifyNoOutstandingRequest()
	}))

	it("constructs directive as video with file", inject(function (
		$httpBackend
	) {
		var options = {
			story: {
				type: "video",
				video_id: 1,
			},
		}
		var model = {}

		$httpBackend.whenGET("http://localhost:9736/api/v1/videos/1").respond({
			data: {
				id: 1,
				video_url: "https://www.youtube.com/watch?v=-SnQ0nSpNac",
			},
		})

		$compile(
			"<div section-story=" +
				JSON.stringify(model) +
				" options=" +
				JSON.stringify(options) +
				"></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
		$httpBackend.flush()
		$httpBackend.verifyNoOutstandingExpectation()
		$httpBackend.verifyNoOutstandingRequest()
	}))

	it("constructs directive as video without file", inject(function (
		$httpBackend
	) {
		var options = {
			story: {
				type: "video",
			},
		}
		var model = {
			video_id: 1,
		}

		$httpBackend.whenGET("http://localhost:9736/api/v1/videos/1").respond({
			data: {
				id: 1,
				video_url: "https://www.youtube.com/watch?v=-SnQ0nSpNac",
			},
		})

		$compile(
			"<div section-story=" +
				JSON.stringify(model) +
				" options=" +
				JSON.stringify(options) +
				"></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
		$httpBackend.flush()
		$httpBackend.verifyNoOutstandingExpectation()
		$httpBackend.verifyNoOutstandingRequest()
	}))

	it("constructs directive provides nothing", function () {
		var options = {
			story: {},
		}
		var model = {}
		$compile(
			"<div section-story=" +
				JSON.stringify(model) +
				" options=" +
				JSON.stringify(options) +
				"></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
	})
})
