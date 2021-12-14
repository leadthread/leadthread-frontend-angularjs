/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("ModalSms", function () {
	"use strict";

	var $modalSms;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$modalSms = $injector.get("$modalSms");
		});
	});

	afterEach(function () {
	});

	it("call ModalSms function", function () {
		expect($modalSms.open).toEqual(false);
		expect($modalSms.type).toEqual("name");
	});

	it("call getNamePromise method", function () {
		$modalSms.getNamePromise();
		expect($modalSms.open).toEqual(true);
		expect($modalSms.type).toEqual("name");
	});
});
