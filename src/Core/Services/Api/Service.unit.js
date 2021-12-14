/* global describe:false, beforeEach:false, afterEach:false, module:false, inject:false, it:false, expect:false */
describe("$api", function () {
	var $httpBackend, $api

	beforeEach(function () {
		module("lt.app")
		inject(function ($injector) {
			// Set up the mock http service responses
			$httpBackend = $injector.get("$httpBackend")
			$api = $injector.get("$api")
		})
		localStorage.clear()
		sessionStorage.clear()
	})

	describe("requests", function () {
		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation()
			$httpBackend.verifyNoOutstandingRequest()
		})

		it("should be defined", function () {
			expect($api).toBeDefined()
		})

		it("calls index route for model", function () {
			var mockIndexResponse = {
				data: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			}

			var mockBatchResponse = {
				data: [
					{
						id: 1,
						first_name: "Tyler",
					},
					{
						id: 2,
						first_name: "Daniel",
					},
				],
			}

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users")
				.respond(mockIndexResponse)

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users/1+2")
				.respond(mockBatchResponse)

			$api.index("users")
				.exec()
				.then(function (data) {
					expect(data).toEqual({ data: mockBatchResponse })
				})

			$httpBackend.flush()
		})

		it("calls index and only fetches the uncached resources", function () {
			var mockIndexResponse = {
				data: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			}

			var mockFirstShowResponse = {
				data: {
					id: 1,
					first_name: "Tyler",
				},
			}

			var mockSecondShowResponse = {
				data: {
					id: 2,
					first_name: "Daniel",
				},
			}

			var mockBatchResponse = {
				data: [
					{
						id: 1,
						first_name: "Tyler",
					},
					{
						id: 2,
						first_name: "Daniel",
					},
				],
			}

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users/1")
				.respond(mockFirstShowResponse)

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users")
				.respond(mockIndexResponse)

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users/2")
				.respond(mockSecondShowResponse)

			$api.show("users", 1)
				.exec()
				.then(function (resp) {
					expect(resp.data).toEqual(mockFirstShowResponse)
					$api.index("users")
						.exec()
						.then(function (resp) {
							expect(resp.data).toEqual(mockBatchResponse)
						})
				})

			$httpBackend.flush()
		})

		it("calls nested index route for model", function () {
			var mockIndexResponse = {
				data: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			}

			var mockBatchResponse = {
				data: [
					{
						id: 1,
						first_name: "Tyler",
					},
					{
						id: 2,
						first_name: "Daniel",
					},
				],
			}

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users/1/referrals")
				.respond(mockIndexResponse)

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users/1/referrals/1+2")
				.respond(mockBatchResponse)

			$api.show("users", 1)
				.index("referrals")
				.exec()
				.then(function (data) {
					expect(data).toEqual({ data: mockBatchResponse })
				})

			$httpBackend.flush()
		})

		it("returns an array for a batch request with a single id", function () {
			var mockBatchResponse = {
				data: {
					id: 1,
					first_name: "Tyler",
				},
			}

			$httpBackend
				.expectGET("http://localhost:9736/api/v1/users/1")
				.respond(mockBatchResponse)

			$api.batch("users", [1])
				.exec()
				.then(function (resp) {
					expect(resp).toEqual([mockBatchResponse.data])
				})

			$httpBackend.flush()
		})
	})

	it("returns an empty array for an empty batch request", function () {
		$api.batch("referrals", [])
			.exec()
			.then(function (data) {
				expect(data).toEqual({ data: { data: [] } })
			})
	})
})
