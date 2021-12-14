/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("$notification", function () {
	"use strict";

	var $notification, $timeout;

	beforeEach(function () {
		module('lt.app');
		inject(function ($injector) {
			$notification = $injector.get("$notification");
			$timeout = $injector.get("$timeout");
		});
	});

	afterEach(function () {
		// flush timeout(s) for all code under test.
		$timeout.flush(10000);

		// this will throw an exception if there are any pending timeouts.
		$timeout.verifyNoPendingTasks();
	});

	it("should be defined", function () {
		expect($notification).toBeDefined();
	});

	it("should create success notification", function () {
		$notification.success("Header", "Message Body");

		expect($notification.notifications.length).toEqual(1);
		var n = _.first($notification.notifications);
		expect(n.header).toEqual("Header");
		expect(n.body).toEqual("Message Body");
		expect(n.type).toEqual("success");
	});

	it("should create error notification", function () {
		$notification.error("Header", "Message Body");

		expect($notification.notifications.length).toEqual(1);
		var n = _.first($notification.notifications);
		expect(n.header).toEqual("Header");
		expect(n.body).toEqual("Message Body");
		expect(n.type).toEqual("error");
	});

	it("should create warning notification", function () {
		$notification.warn("Header", "Message Body");

		expect($notification.notifications.length).toEqual(1);
		var n = _.first($notification.notifications);
		expect(n.header).toEqual("Header");
		expect(n.body).toEqual("Message Body");
		expect(n.type).toEqual("warning");
	});

	it("should not add a duplicate notification", function () {
		for (var i = 0; i<2; i++) {
			$notification.success("Header", "Message Body");
		}
		expect($notification.notifications.length).toEqual(1);
	});

	it("should add notifications on to the queue", function () {
		for (var i = 0; i<8; i++) {
			$notification.success("Header"+i, "Message Body"+i);
		}
		expect($notification.notifications.length).toEqual(7);
		expect($notification.queue.length).toEqual(1);
	});

	it("should clear notifications", function () {
		for (var i = 0; i<8; i++) {
			$notification.success("Header"+i, "Message Body"+i);
		}
		expect($notification.notifications.length).toEqual(7);
		expect($notification.queue.length).toEqual(1);

		$notification.clear(0);
		expect($notification.notifications.length).toEqual(7);
		expect($notification.queue.length).toEqual(0);

		$notification.clear(0);
		expect($notification.notifications.length).toEqual(6);
		expect($notification.queue.length).toEqual(0);
	});

	it("should remove items automatically", inject(function ($rootScope) {
		for (var i = 0; i<8; i++) {
			$notification.success("Header"+i, "Message Body"+i, 0);
		}
		expect($notification.notifications.length).toEqual(7);
		expect($notification.queue.length).toEqual(1);

		$rootScope.$apply();

		// flush timeout(s) for all code under test.
		$timeout.flush();

		// this will throw an exception if there are any pending timeouts.
		$timeout.verifyNoPendingTasks();

		expect($notification.notifications.length).toEqual(0);
		expect($notification.queue.length).toEqual(0);

	}));
});
