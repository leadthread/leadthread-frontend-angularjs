import _ from "lodash"

export const key = "ctaButtons"

export const inject = ["$popup"]

export const fn = ($popup) => {
	return {
		restrict: "EA",
		templateUrl: "components/cta-buttons/index.html",
		scope: {
			buttons: "=ctaButtons",
			placeholders: "=",
			options: "=",
		},
		link: function ($scope) {
			function init() {
				$scope.add = add
				$scope.remove = remove
				$scope.up = up
				$scope.down = down
				$scope.onTypeChange = onTypeChange
				$scope.getHelpText = getHelpText

				$scope.options = $scope.options || {}
				$scope.icons = [
					"bullhorn",
					"calendar",
					"check-square",
					"comments",
					"dollar",
					"download",
					"envelope-square",
					"envelope",
					"external-link-square",
					"external-link",
					"eye",
					"facebook-square",
					"file-o",
					"globe",
					"graduation-cap",
					"group",
					"handshake-o",
					"instagram",
					"lightbulb-o",
					"link",
					"linkedin-square",
					"map-marker",
					"pencil-square",
					"pencil",
					"phone-square",
					"phone",
					"play-circle",
					"question",
					"search",
					"share-alt",
					"share-square",
					"share",
					"shopping-cart",
					"sign-in",
					"snapchat-square",
					"thumb-tack",
					"thumbs-o-down",
					"thumbs-o-up",
					"ticket",
					"twitter-square",
					"youtube-play",
					"youtube",
				]

				$scope.types = [
					{
						type: "register",
						name: "Register Button",
						icon: "pencil",
						text: "Learn More!",
						help: "Allows people to fill out a registration form.",
						success_message:
							"Thank You. We will contact you with more information.",
					},
					{
						type: "tel",
						name: "Call Button",
						icon: "phone",
						text: "Call [Sender First Name]",
						help: "Call Button lets the contact/referral contact your reps via phone",
					},
					{
						type: "sms",
						name: "SMS Button",
						icon: "comments",
						text: "Text [Sender First Name]",
						help: "SMS Button lets the contact/referral contact your reps via sms text message",
					},
					{
						type: "mailto",
						name: "Email Button",
						icon: "envelope",
						text: "Email [Sender First Name]",
						help: "Email Button lets the contact/referral contact your reps via email",
					},
					{
						type: "url",
						name: "URL Button",
						icon: "external-link",
						text: "Click Here",
						help: "URL Button lets the contact/referral visit any website link that you provide",
					},
				]

				if ($scope.options.types) {
					$scope.types = _.unionWith(
						$scope.types,
						$scope.options.types,
						function (a, b) {
							return a.type === b.type
						}
					)
				}

				if ($scope.buttons === null) {
					$scope.buttons = []
					add()
				}
			}

			function remove(index) {
				$scope.buttons.splice(index, 1)
			}

			function add() {
				$scope.buttons.push({
					type: "tel",
					text: "Call [Sender First Name]",
					button_icon: "phone",
					company_id: null,
					success_message: null,
				})
			}

			function onTypeChange(button) {
				let x = _.find($scope.types, { type: button.type })
				if (x) {
					button.text = x.text
					button.success_message = x.success_message
					button.button_icon = x.icon
				}

				sort()
			}

			function sort() {
				$scope.buttons = _.sortBy($scope.buttons, [
					function (button) {
						return button.type === "register" ? -1 : 1
					},
				])
			}

			function up(index) {
				if (index > 0) {
					swap($scope.buttons, index, index - 1)
				}
			}

			function down(index) {
				if (index < $scope.buttons.length - 1) {
					swap($scope.buttons, index, index + 1)
				}
			}

			function swap(arr, indexA, indexB) {
				let temp = arr[indexA]
				arr[indexA] = arr[indexB]
				arr[indexB] = temp

				sort()
			}

			function getHelpText(button) {
				let x = _.find($scope.types, { type: button.type })
				if (x) {
					return x.help
				}
			}

			init()
		},
	}
}
