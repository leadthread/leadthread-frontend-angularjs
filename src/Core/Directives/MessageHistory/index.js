import $ from "jquery"
import moment from "moment"
import _ from "lodash"

export const key = "messageHistory"

export const inject = ["$http", "$timeout", "$stateParams", "$messages"]

export const fn = ($http, $timeout, $stateParams, $messages) => {
	return {
		restrict: "EA",
		template: require("./index.html"),
		scope: {
			contact: "=",
		},
		link: function ($scope) {
			function init() {
				defineScope()
				defineListeners()
			}

			function defineScope() {
				$scope.draft = ""
				$scope.sendMessage = sendMessage
				// $scope.messages = loadMessages();
			}

			function defineListeners() {
				// Keypresses
				$(".message-draft").keydown(function (event) {
					if (event.keyCode == 13 && event.shiftKey == false) {
						event.preventDefault()
						if (!_.isEmpty($scope.draft)) {
							sendMessage()
						}
					}
				})

				// Message length changes
				$scope.$watch("contact.messages.length", onMessageCountChange)

				// Contact changes
				$scope.$watch("contact.id", onContactIdChange)
			}

			function onContactIdChange(id) {
				$messages.loadMessages(id).then(function (messages) {
					if (id === $scope.contact.id) {
						$scope.contact.messages = _.unionBy(
							$scope.contact.messages,
							messages,
							"id"
						)
					}
				})
			}

			var scrollToBottom = function () {
				var div = document.getElementsByClassName("thread-body")[0]
				div.scrollTop = div.scrollHeight - div.clientHeight
			}

			var sendMessage = function () {
				var msg = $scope.draft
				$scope.draft = ""
				$http
					.post("/api/v1/sms/send/message", {
						contact_id: $scope.contact.id,
						message: msg,
						company_id: $stateParams.companyId,
					})
					.then(
						function () {
							var timestamp = moment().format(
								"YYYY-MM-DD HH:mm:ss"
							)
							$scope.contact.messages.push({
								message: msg,
								inbound: false,
								seen: true,
								created_at: timestamp,
							})
							$timeout(scrollToBottom, 1)
						},
						function () {
							if ($scope.draft === "") {
								$scope.draft = msg
							}
						}
					)
			}

			var onMessageCountChange = function () {
				$messages.markMessagesAsRead($scope.contact)
				$timeout(scrollToBottom, 1)
			}

			init()
		},
	}
}
