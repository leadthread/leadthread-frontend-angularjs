import _ from "lodash"

export const key = "sectionRegister"

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
			model: "=sectionRegister",
			options: "=",
		},
		link: function ($scope, $el) {
			function init() {
				$scope.controls = getControls()
				$scope.link = _.get($scope, "options.link")

				//Functions
				$scope.submit = submit
				$scope.getSectionStyle = getSectionStyle

				defineListeners()
			}

			function defineListeners() {}

			function getControls() {
				let controls = []

				controls.push({
					type: "input",
					subtype: "text",
					label: "Your First Name",
					key: "first_name",
					value: null,
					required: true,
				})
				controls.push({
					type: "input",
					subtype: "text",
					label: "Your Last Name",
					key: "last_name",
					value: null,
					required: true,
				})
				controls.push({
					type: "input",
					subtype: "tel",
					label: "Your Mobile Number",
					key: "phone",
					value: null,
					required: true,
				})
				controls.push({
					type: "input",
					subtype: "email",
					label: "Your Email (Optional)",
					key: "email",
					value: null,
					required: false,
				})

				return controls
			}

			function submit(valid) {
				if (valid) {
					let data = _.reduce(
						$scope.controls,
						(carry, control) => {
							carry[control.key] = control.value
							return carry
						},
						{}
					)

					data = _.merge(data, {
						user_id: _.get($scope, "options.link.user_id"),
						company_id: _.get($scope, "options.link.company_id"),
						campaign_id: _.get($scope, "options.link.campaign_id"),
						sent_via: _.get($scope, "options.link.sent_via"),
					})

					let promise = $http({
						method: "POST",
						url: "/api/v1/links/contact",
						data: data,
					}).then(function (x) {
						return x.data.data
					})

					return $popup
						.while(promise, "Almost Done...")
						.then(() => {
							return promise
						})
						.then(redirect)
				}
			}

			function redirect(link) {
				window.location.href =
					link.long_url + "#?page=0&scrollTo=share_title"
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
