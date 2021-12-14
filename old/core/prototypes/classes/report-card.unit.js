/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false */
describe("ReportCard Spec", function () {
	"use strict";

	var ReportCard;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			ReportCard = $injector.get("ReportCard");
		});
	});

	it("Check if ReportCard factory is defined", function () {
		expect(ReportCard).toBeDefined();
	});

	it("Adds a click handler", function () {
		var x = new ReportCard("Title");
		
		var onClick = function () {
			return 2+2;
		};

		x.addClickHandler(onClick);

		expect(x.onClick).toEqual(onClick);
	});

	it("Adds a non function click handler", function () {
		var x = new ReportCard("Title");
		
		var onClick = 7;

		x.addClickHandler(onClick);

		expect(x.onClick instanceof Function).toEqual(true);
		expect(x.onClick()).toEqual(7);
	});

	it("Adds a row", function () {
		var x = new ReportCard("Title");

		var stats = [];
		stats.push({"key":"Invites", "value": 0});
		stats.push({"key":"Leads", "value": 0});
		stats.push({"key":"Warm", "value": 0});
		stats.push({"key":"Hot", "value": 0});
		x.addRow({color: "#87c0d8", icon: "icon-comments", data: stats});

		expect(x.rows.length).toEqual(1);
		expect(x.rows[0].color).toEqual("#87c0d8");
		expect(x.rows[0].icon).toEqual("icon-comments");
		expect(x.rows[0].data).toEqual(stats);
	});

	it("Add sub title row", function () {
		var x = new ReportCard("Title");

		var stats = [];
		stats.push({"key":"Invites", "value": 0});
		stats.push({"key":"Leads", "value": 0});
		stats.push({"key":"Warm", "value": 0});
		stats.push({"key":"Hot", "value": 0});
		x.addSubTitleRow({color: "#87c0d8", icon: "icon-comments", data: stats});

		expect(x.rows.length).toEqual(1);
		expect(x.rows[0].color).toEqual("#87c0d8");
		expect(x.rows[0].icon).toEqual("icon-comments");
		expect(x.rows[0].data).toEqual(stats);
	});
});
