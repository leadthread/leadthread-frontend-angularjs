/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("sitePageSectionEditor directive", function () {
	"use strict";
	var $compile, $rootScope;

	beforeEach(module('lt.app'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
});