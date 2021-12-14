/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("popup", function () {
	var $popup

	beforeEach(function () {
		module("lt.app")
		inject(function ($injector) {
			$popup = $injector.get("$popup")
		})
	})

	afterEach(function () {})

	it("calls form function", function () {
		$popup.form("test", "test", false).then(function (resp) {
			expect(resp).toEqual({
				form: "test",
				prompt: "test",
				type: "form",
				_showSafariAutofillHelper: false,
			})
		})
	})

	it("calls single function", function () {
		$popup
			.single(
				"test",
				"test",
				"favorites",
				"what is your favorite",
				"input",
				"text",
				null,
				null,
				null
			)
			.then(function (resp) {
				expect(resp).toEqual({
					form: {
						key: "test",
						value: "test",
						prompt: "favorites",
						label: "what is your favorite",
						type: "input",
						subtype: "text",
						choices: null,
						minlength: null,
						maxlength: null,
					},
					prompt: "favorites",
					type: "form",
					_showSafariAutofillHelper: false,
				})
			})
	})

	it("calls input function", function () {
		$popup
			.input(
				"test",
				"test",
				"favorites",
				"what is your favorite",
				null,
				null
			)
			.then(function (resp) {
				expect(resp).toEqual({
					form: {
						key: "test",
						value: "test",
						prompt: "favorites",
						label: "what is your favorite",
						minlength: null,
						maxlength: null,
					},
					prompt: "favorites",
					type: "form",
					_showSafariAutofillHelper: false,
				})
			})
	})

	it("calls tel function", function () {
		$popup
			.tel("test", "test", "favorites", "what is your favorite")
			.then(function (resp) {
				expect(resp).toEqual({
					form: {
						key: "test",
						value: "test",
						prompt: "favorites",
						label: "what is your favorite",
						minlength: null,
						maxlength: null,
					},
					prompt: "favorites",
					type: "form",
					_showSafariAutofillHelper: false,
				})
			})
	})

	it("calls textarea function", function () {
		$popup
			.textarea("test", "test", "favorites", "what is your favorite")
			.then(function (resp) {
				expect(resp).toEqual({
					form: {
						key: "test",
						value: "test",
						prompt: "favorites",
						label: "what is your favorite",
						minlength: null,
						maxlength: null,
					},
					prompt: "favorites",
					type: "form",
					_showSafariAutofillHelper: false,
				})
			})
	})

	it("calls select function", function () {
		$popup
			.select("test", "test", "favorites", "what is your favorite", [
				"Red",
				"Pizza",
				"soft tissue",
			])
			.then(function (resp) {
				expect(resp).toEqual({
					form: {
						key: "test",
						value: "test",
						prompt: "favorites",
						label: "what is your favorite?",
						choices: ["Red", "Pizza", "soft tissue"],
					},
					prompt: "favorites",
					type: "form",
					_showSafariAutofillHelper: false,
				})
			})
	})

	it("calls functions for popups without forms", function () {
		$popup.info("test", "info")
		$popup.decide("test", "info")
		$popup.delay("test", "info")
		$popup.while("test", "info")
	})

	describe("popup controller", function () {
		var $controller, $rootScope

		beforeEach(inject(function (_$controller_) {
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$controller = _$controller_
		}))

		beforeEach(inject(function ($injector) {
			$rootScope = $injector.get("$rootScope")
		}))

		it("runs controller init", function () {
			var $scope = $rootScope.$new()
			$controller("PopupController", {
				options: {
					text: "test",
					prompt: "prompt",
					type: "info",
				},
				$scope: $scope,
				$uibModalInstance: {
					close: function () {
						return true
					},
				},
			})
		})

		it("runs with options.type of delay", function () {
			var $scope = $rootScope.$new()
			$controller("PopupController", {
				options: {
					timeout: 1,
					text: "test",
					type: "delay",
				},
				$scope: $scope,
				$uibModalInstance: {
					close: function () {
						return true
					},
				},
			})
			$scope.ok()
		})

		it("runs with options.type of while", inject(function ($q) {
			var $scope = $rootScope.$new()
			$controller("PopupController", {
				options: {
					promise: $q(function () {
						return true
					}),
					text: "test",
					type: "while",
				},
				$scope: $scope,
				$uibModalInstance: {
					close: function () {
						return true
					},
				},
			})

			$scope.ok()
		}))

		it("runs controller with a form", function () {
			var $scope = $rootScope.$new()
			$controller("PopupController", {
				options: {
					form: "form",
					prompt: "test",
					type: "form",
				},
				$scope: $scope,
				$uibModalInstance: {
					close: function () {
						return true
					},
					dismiss: function () {
						return true
					},
				},
			})

			$scope.ok()
			$scope.cancel()
		})
	})
})
