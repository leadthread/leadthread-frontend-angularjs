/* global describe:false, beforeEach:false, module:false, inject:false, it:false, expect:false, $:false */
describe("Directive \"notification\"", function () {
	var $compile, $rootScope, $notification

	// Load the myApp module, which contains the directive
	beforeEach(module("lt.app"))

	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function (_$compile_, _$rootScope_, _$notification_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_
		$rootScope = _$rootScope_
		$notification = _$notification_
	}))

	it("can be created", function () {
		// Compile a piece of HTML containing the directive
		var element = $compile("<div notification-directive></div>")($rootScope)

		$notification.success("title", "this is a notification")

		$rootScope.$digest()

		expect(element.html()).toContain("this is a notification")
	})

	it("can clear a notification", function () {
		// Compile a piece of HTML containing the directive
		var element = $compile("<div notification-directive></div>")($rootScope)

		$notification.success("title", "this is a notification")
		$rootScope.$digest()

		$("body").append(element)
		$(element).find(".notif").first().click()

		$rootScope.$digest()

		expect(element.html()).not.toContain("this is a notification")
		$("body").find("[notification-directive]").first().remove()
		$rootScope.$apply()
	})
})
