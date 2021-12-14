import _ from "lodash"
import { PersonClass as Person } from "../../Classes"

export const key = "sender"

export const inject = ["$localStorage", "$http", "$auth", "$company", "$q"]

export const fn = ($localStorage, $http, $auth, $company, $q) => {
	return {
		restrict: "A",
		templateUrl: "components/sender/index.html",
		scope: {
			contacts: "=",
			options: "=",
			type: "@",
		},
		link: function ($scope) {
			/**
			 * Start it up
			 */
			function init() {
				$scope.sending = false
				$scope.getContactsToSend = getContactsToSend
				$scope.getContactsToNotSend = getContactsToNotSend
				$scope.modalCalled = false
				$scope.link = null
				$scope.getSmsLink = getSmsLink
				$scope.markAsSent = markAsSent
				$scope.collectCompany = $scope.options.collectCompany || false

				var contacts = load()
				$scope.contacts = _.unionWith(
					$scope.contacts,
					contacts,
					function (a, b) {
						return a.phone.valueOf() === b.phone.valueOf()
					}
				)

				if ($scope.type == "Customer") {
					getCampaignLink().then(function (resp) {
						$scope.link = resp
						$scope.linkcpy = resp
					})
				}

				defineListeners()
			}

			/**
			 * Listen to the ocean
			 */
			function defineListeners() {
				$scope.$watch(
					function () {
						return getContactsToSend().length
					},
					function (n, o) {
						if (n !== o) {
							store(getContactsToSend())
						}
					}
				)
				if ($scope.type == "Customer") {
					$scope.$watch(
						function () {
							return $scope.linkcpy
						},
						function () {
							$scope.linkcpy = $scope.link
						}
					)
				}
			}

			/**
			 * Loads data from local storage
			 * @return {array} An array of People objects
			 */
			function load() {
				var raw = $localStorage.get(getKey())
				var arr = []
				_.each(raw, function (x) {
					var y = new Person(x)
					y.sent = false
					arr.push(y)
				})

				return arr
			}

			/**
			 * Stores data to local storage
			 * @param  {mixed} data The stuff to store
			 */
			function store(data) {
				$localStorage.set(getKey(), data)
			}

			/**
			 * Gets the Link for copy and paste functionallity
			 * @return {string} URL link
			 */
			function getCampaignLink() {
				return $q(function (resolve, reject) {
					$company.getId().then(function (company_id) {
						return $http
							.post("/api/v1/links/campaign", {
								user_id: $auth.getUserId(),
								campaign_id: $scope.options.getCampaignId(),
								target_id: $scope.options.getCampaignId(),
								company_id: company_id,
							})
							.then(function (resp) {
								resolve(resp)
							}, reject)
					}, reject)
				})
			}

			/**
			 * Gets all contacts that have not been sent a SMS
			 * @return {array} Array of People objects
			 */
			function getContactsToSend() {
				return _.filter($scope.contacts, function (contact) {
					return !contact.sent
				})
			}

			/**
			 * Gets all contacts that have been sent a SMS
			 * @return {array} Array of People objects
			 */
			function getContactsToNotSend() {
				return _.filter($scope.contacts, function (contact) {
					return contact.sent
				})
			}

			/**
			 * Gets the URL for sending an sms message for a contact at index
			 * @param  {integer} index Index of contact
			 * @return {string}        URL for sending an sms message
			 */
			function getSmsLink(index) {
				var contact = getContactsToSend()[index]
				return contact.link
			}

			/**
			 * Marks a contact at the specified index as sent
			 * @param  {integer} index Index of contact
			 */
			function markAsSent(index) {
				var contact = getContactsToSend()[index]
				contact.sent = true
				$http.post("/api/v1/links/sent-via", {
					long_url: contact.link.url,
					sent_via: "sms",
				})
			}

			/**
			 * Returns the local storage key to use
			 * @return {string} The key
			 */
			function getKey() {
				return window.location + "|sender"
			}

			init()
		},
	}
}
