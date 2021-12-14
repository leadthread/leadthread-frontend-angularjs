/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("PromptBuilderCustomController", function () {
	beforeEach(module("lt.app"))

	var $controller

	beforeEach(inject(function (_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_
	}))

	describe("construct controller", function () {
		it("passes empty scope", function () {
			var $scope = {}
			var mi = {
				open: function () {
					return true
				},
				close: function () {
					return false
				},
				dismiss: function () {
					return false
				},
			}
			var Prompt = function Prompt() {}
			var controller = $controller("PromptBuilderCustomController", {
				$scope: $scope,
				Prompt: Prompt,
				$uibModalInstance: mi,
			})
			expect(controller).toBeDefined()
		})
	})
})
