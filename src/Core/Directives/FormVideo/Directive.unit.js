/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("formVideo directive", function () {
	var $compile, $rootScope

	beforeEach(module("lt.app"))

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_
		$rootScope = _$rootScope_
	}))

	it("constructs directive", inject(function ($httpBackend) {
		$httpBackend
			.whenPOST("http://localhost:9736/api/v1/videos")
			.respond({ data: {} })
		$compile(
			"<div form-video='{video_id:1, video_url:\"https://www.youtube.com/watch?v=5pFX2P7JLwA\", video_service:\"viddler\"}'></div>"
		)($rootScope)
		$rootScope.$apply()
		$rootScope.$digest()
		$httpBackend.flush()
	}))
})
