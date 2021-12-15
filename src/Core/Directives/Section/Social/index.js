import a2a from "a2a"
import _ from "lodash"

export const key = "sectionSocial"

export const inject = [
	"$q",
	"$device",
	"$timeout",
	"$popup",
	"$http",
	"$notification",
]

export const fn = ($q, $device, $timeout, $popup, $http, $notification) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			model: "=sectionSocial",
			options: "=",
		},
		link: function ($scope, $el) {
			function init() {
				// Values
				$scope.lock = "Loading"
				$scope.socialUrl = ""
				$scope.socialMsg = ""

				// Funcs
				$scope.showFullA2AMenu = showFullA2AMenu
				$scope.nextPage = nextPage

				// Exec
				getSocialRequirements().then(
					function (resp) {
						$scope.socialMsg = resp.msg
						$scope.socialUrl = resp.url
						a2aInit()
						$scope.lock = null
					},
					function (reason) {
						$scope.lock = null
						$notification.error("Error", reason)
					}
				)
			}

			function a2aInit() {
				if (typeof a2a !== "undefined") {
					setTimeout(function () {
						function my_addtoany_onshare(share_data) {
							var cancel = false

							$http
								.post("/api/v1/links/sent-via", {
									long_url: share_data.url,
									sent_via: share_data.node.a2a.safename,
								})
								.then(function () {
									$scope.lock = "Waiting"
									$q.when(
										$scope.options.getUrlFn({
											sent_via: null,
										})
									).then(
										function (resp) {
											$scope.socialUrl = resp
											$scope.lock = null
										},
										function () {
											$scope.lock = null
										}
									)
								})

							// Cancel share if the request failed
							if (cancel == true) {
								return {
									stop: true,
								}
							}

							// Modify the share by returning an object with
							// "url" and "title" properties containing the new URL and title
							return {
								url: share_data.url,
								title: share_data.title,
							}
						}

						// Setup AddToAny "onShare" callback function
						var a2a_config = a2a_config || {}
						a2a_config.callbacks = a2a_config.callbacks || []
						a2a_config.callbacks.push()

						a2a.init("page", {
							target: ".a2a_init",
							show_title: true,
							num_services: 999,
							templates: {
								twitter: "${title} ${link}",
								email: {
									subject: "${title}",
									body: "${title}\n${link}",
								},
							},
							callbacks: [
								{
									share: my_addtoany_onshare,
								},
							],
						})
					}, 100)
				}
			}

			function showFullA2AMenu(e) {
				if (typeof a2a !== "undefined") {
					e.preventDefault()
					a2a.show_full()
				}
			}

			function nextPage() {
				$scope.$emit("SiteNext")
			}

			/**
			 * Builds the social requirements
			 */
			function getSocialRequirements() {
				var preA2APromises = {}
				if (_.isFunction($scope.options.getUrlFn)) {
					preA2APromises.url = $q.when(
						$scope.options.getUrlFn({ sent_via: null })
					)
				}
				if (_.isFunction($scope.options.getSocialMsgFn)) {
					preA2APromises.msg = $q.when(
						$scope.options.getSocialMsgFn()
					)
				}

				return $q.all(preA2APromises)
			}

			init()
		},
	}
}
