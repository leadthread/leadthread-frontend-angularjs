import angular from "angular"
import _ from "lodash"

export const key = "sectionTestimonial"

export const inject = ["$q", "$popup", "$window"]

export const fn = ($q, $popup, $window) => {
	return {
		restrict: "AE",
		templateUrl: "components/section/testimonial/index.html",
		scope: {
			options: "=",
		},
		link: function ($scope, $el) {
			/**
			 * Start it up
			 */
			function init() {
				defineScope()
				defineListeners()
			}

			/**
			 * Defines the scope
			 */
			function defineScope() {
				$scope.nextStep = nextStep
				$scope.collectVideo = collectVideo
				$scope.collectImage = collectImage
				$scope.collectCaption = collectCaption
				$scope.isStoryDone = isStoryDone
				$scope.storyTypes = {
					"Video Message": "video",
					"Written Message": "image",
				}
				$scope.storyTypeIcons = {
					video: "icon-video-camera",
					image: "icon-edit",
				}
			}

			/**
			 * Defines listeners
			 */
			function defineListeners() {
				$scope.$watch("options.story.type", onStoryTypeChange)
				$scope.$watch("options.story.video.id", function (n) {
					if (n) {
						scrollToSelf()
					}
				})
				$scope.$watch("options.story.image.id", function (n) {
					if (n) {
						scrollToSelf()
					}
				})
			}

			/**
			 * Handles the story type change
			 */
			function onStoryTypeChange() {
				var story = $scope.options.story
				if (story.type === "video") {
					collectVideo()
				}

				if (story.type === "image") {
					collectCaption().then(function () {
						if (!$scope.options.story.image) {
							$popup
								.decide(
									"Do you want to add a fun image to attach to your message?",
									"You can use your phone's camera or select an existing image from your phone."
								)
								.then(collectImage, nextStep)
						}
					})
				}

				if (story.type === "none") {
					nextStep()
				}
			}

			/**
			 * Clicks the video uploader button programmatically
			 */
			function collectVideo() {
				$el.find("#video [form-file] input[type=file]").click()
			}

			/**
			 * Clicks the image uploader button programmatically
			 */
			function collectImage() {
				$el.find("#image [form-file] input[type=file]").click()
			}

			/**
			 * Shows a testimonial form popup
			 */
			function collectCaption() {
				return $popup
					.textarea(
						"caption",
						$scope.options.story.caption,
						"What do you want to say to your contacts?",
						null,
						6
					)
					.then(function (resp) {
						$scope.options.story.caption = resp.caption
						return resp
					})
			}

			/**
			 * Goes to the next step or page
			 */
			function nextStep() {
				if (isStoryDone()) {
					$scope.$emit("SiteNext")
				}
			}

			/**
			 * Checks if the story is finished based on the story type
			 * @return {Boolean} Finished or not
			 */
			function isStoryDone() {
				var done = false
				var story = $scope.options.story

				switch (story.type) {
					case "none":
						done = true
						break
					case "video":
						if (story.video && story.video.id) {
							done = true
						}
						break
					case "image":
						if (
							_.isString(story.caption) &&
							story.caption.length > 5
						) {
							done = true
						}
						break
				}

				return done
			}

			/**
			 * Attempt to scroll to itself
			 */
			function scrollToSelf() {
				setTimeout(function () {
					var top = $el.offset().top
					angular
						.element("html, body")
						.animate({ scrollTop: top }, "fast")
				}, 200)
			}

			init()
		},
	}
}
