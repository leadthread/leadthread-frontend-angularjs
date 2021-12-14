/*
* @Author: Tyler Arbon
* @Date:   2016-12-02 10:15:48
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-06-22 13:32:27
*/
/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("Campaign Form", function () {
	"use strict";

	var CampaignForm, CustomerExperienceCampaignForm;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			CampaignForm = $injector.get("CampaignForm");
			CustomerExperienceCampaignForm = $injector.get("CustomerExperienceCampaignForm");
		});
	});

	it("Creates a CampaignForm", function () {
		var form = new CampaignForm();
		var res = form instanceof CampaignForm;
		expect(res).toEqual(true);
	});

	it("tests validation function", function () {
		var form = new CustomerExperienceCampaignForm();
		form.setFieldValue("campaignName", "test");
		form.setFieldValue("campaignColor", "#ffffff");
		form.setFieldValue("companyLogoColor", "#ffffff");
		form.setFieldValue("companyLogo", {});
		form.setFieldValue("channelType", "sms");
		form.setFieldValue("mediaType", "image");
		form.setFieldValue("image", {});
		form.setFieldValue("uPMessage", "Hi! It’s [sales rep first name] from [company]. I’ve made it easy to share your buying experience with your contacts. Click here to invite:");
		form.setFieldValue("mediaType", "image");
		form.setFieldValue("image", {id:10});
		form.setFieldValue("includeCues", false);
		form.setFieldValue("pRMessage", "Hi! It’s [sales rep first name] from [company]. I’ve made it easy to share your buying experience with your contacts. Click here to invite:");
		expect(form.isValid()).toEqual(true);
	});
});
