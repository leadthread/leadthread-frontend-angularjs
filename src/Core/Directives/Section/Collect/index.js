import $ from "jquery"
import _ from "lodash"

export const key = "sectionCollect"

export const inject = [
	"$device",
	"$http",
	"$q",
	"$sms",
	"$popup",
	"$timeout",
	"$localStorage",
	"EventService",
]

export const fn = (
	$device,
	$http,
	$q,
	$sms,
	$popup,
	$timeout,
	$localStorage,
	EventService
) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			model: "=sectionCollect",
			options: "=",
		},
		link: function ($scope, $el) {
			let COLLECT_REFERRAL = null
			let seenPopup = false
			let cacheKeyReferrals = [
				_.get($scope, "options.link.id", 0),
				"referrals",
			].join("|")
			let cacheKeyReferralsSent = [
				_.get($scope, "options.link.id", 0),
				"referrals_sent",
			].join("|")

			function init() {
				$scope.referrals = $localStorage.get(cacheKeyReferrals) || []
				$scope.referrals_sent =
					$localStorage.get(cacheKeyReferralsSent) || []
				$scope.title = {
					company_id: null,
					type: "text",
					text: "Your Friends",
					icon: "user-plus",
					font_size: 24,
				}
				$scope.instructions = {
					company_id: null,
					type: "text",
					text: "Click the send button below to share a text message invite with your friends to learn more",
				}
				$scope.controls = getControls()
				$scope.link = _.get($scope, "options.link")

				//Functions
				$scope.submit = submit
				$scope.send = send
				$scope.getSectionStyle = getSectionStyle
				$scope.referralsLoading = referralsLoading

				defineListeners()
			}

			function defineListeners() {
				//Watchers
				$scope.$watch("referrals.length", cacheReferrals)
				$scope.$watch("referrals_sent.length", cacheReferrals)
			}

			function referralsLoading() {
				return (
					_.filter($scope.referrals, function (x) {
						return !x.link
					}).length > 0
				)
			}

			function cacheReferrals() {
				$localStorage.set(cacheKeyReferrals, $scope.referrals)
				$localStorage.set(cacheKeyReferralsSent, $scope.referrals_sent)
			}

			function getControls() {
				let controls = []

				controls.push({
					type: "input",
					subtype: "text",
					label: "Friend's First Name",
					key: "first_name",
					value: null,
					required: true,
				})
				controls.push({
					type: "input",
					subtype: "text",
					label: "Friend's Last Name",
					key: "last_name",
					value: null,
					required: true,
				})
				controls.push({
					type: "input",
					subtype: "tel",
					label: "Friend's Mobile Number",
					key: "phone",
					value: null,
					required: true,
				})
				controls.push({
					type: "input",
					subtype: "email",
					label: "Friend's Email (Optional)",
					key: "email",
					value: null,
					required: false,
				})

				return controls
			}

			function submit(valid) {
				if (valid) {
					let referral = _.reduce(
						$scope.controls,
						(carry, control) => {
							carry[control.key] = control.value
							return carry
						},
						{}
					)

					resetForm()

					$scope.referrals.push(referral)

					return saveReferral(referral)
						.then(
							function (data) {
								return $sms
									.getSmsHref(
										$scope.options.getMsgFn(),
										data.link.long_url,
										data.referral,
										false
									)
									.then((href) => {
										for (var key in data.referral) {
											referral[key] = data.referral[key]
										}
										referral.href = href
										referral.link = data.link
										return referral
									})
							},
							function () {
								_.remove($scope.referrals, referral)
							}
						)
						.then(function (data) {
							cacheReferrals()
							return data
						})
				}
			}

			function resetForm() {
				_.forEach($scope.controls, function (control) {
					control.value = null
				})
				$scope.collectForm.$setPristine()
			}

			function saveReferral(referral) {
				return $http
					.post("/api/v1/links/" + $scope.link.id + "/provide", {
						referral: referral,
					})
					.then(function (response) {
						return response.data.data
					})
			}

			function showHowToGetBackPopup() {
				let url = $device.isApple()
					? "../../../../img/sms/helper_iphone.png"
					: "../../../../img/sms/helper_android.png"
				let promise = seenPopup
					? true
					: $popup.info(
							"How to return",
							"<img style='width:100%' src='" +
								url +
								"'/><br><br>After you send the message be sure to click the button shown above to get back.",
							"Got It"
					  )
				return $q.when(promise).finally(() => {
					$("html, body")
						.stop()
						.animate(
							{
								scrollTop: $("div[footer]").offset().top,
							},
							200
						)
					seenPopup = true
				})
			}

			function recordSend(referral) {
				return $q.all({
					href: referral.href,
					event: EventService.record(
						$scope.link,
						"sent_sms",
						referral.id
					),
				})
			}

			function send(referral) {
				if (!seenPopup && $scope.referrals_sent.length === 0) {
					showHowToGetBackPopup()
				} else {
					if (referral) {
						recordSend(referral)
						_.remove($scope.referrals, { id: referral.id })
						$scope.referrals_sent.push(referral)
						cacheReferrals()
					}

					location.href = referral.href
				}
			}

			function getSectionStyle(section) {
				let style, padding_vertical

				style = {
					background: section.background_color,
					color: section.font_color,
					"font-size": section.font_size + "px",
					"text-align": section.text_align,
				}

				return style
			}

			init()
		},
	}
}
