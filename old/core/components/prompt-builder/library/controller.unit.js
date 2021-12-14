/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("PromptBuilderLibraryController", function () {
	"use strict";
	beforeEach(module('lt.app'));

	var $controller;

	beforeEach(inject(function (_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe("construct controller", function () {
		it("passes empty scope", inject(function ($rootScope, $q) {
			var $scope = $rootScope.$new();
			var mi = {
				open: function () {return true;},
				close: function () {return false;},
				dismiss: function () {return false;}
			};
			var Prompt = function Prompt () {

			};
			var company = {
				getIndustry: function () {
					return $q(function (resolve) {
						resolve("auto");
					});
				}
			};
			var controller = $controller("PromptBuilderLibraryController", { $scope: $scope, Prompt:Prompt, $uibModalInstance: mi, $company: company});
			expect(controller).toBeDefined();
		}));
	});
});