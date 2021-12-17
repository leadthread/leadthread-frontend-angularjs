import angular from "angular"

export const key = "placeholderInsert"

export const inject = ["$textInsert", "$popup"]

export const fn = ($textInsert, $popup) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			selector: "@placeholderInsert",
			placeholders: "=",
		},
		link: function ($scope) {
			/**
			 * Start it up
			 */
			function init() {
				$scope.insert = insert
				$scope.openHelp = openHelp
			}

			/**
			 * Inserts text into an input element at its cursor location
			 * @param  {String} $selector The input element selector string
			 * @param  {String}      text The text to insert
			 * @return {String|void}
			 */
			function insert(text) {
				return $textInsert.insert(
					angular.element($scope.selector)[0],
					"[" + text + "]"
				)
			}

			/**
			 * Opens a help popup
			 */
			function openHelp() {
				$popup.info(
					"What are Placeholders?",
					"<p><b>Placeholder text</b> is descriptive <b>text</b> displayed inside your campaign. It is often used to handle dynamic information. To use, simply insert one of the placeholder options into the text field that you are creating and Yaptive will input the information into your campaign. It’s a powerful tool for creating a personal experience within your campaign automatically.</p>" +
						"<p><b>For Example:</b></p>" +
						"<p>\"Hi <span style=\"color:blue;\">[customer first name]</span>, I really appreciate your business and would love for you to share you experience. Your friends and family will also have a great experience at <span style=\"color:blue;\">[company name]</span> with <span style=\"color:blue;\">[sales rep first name]</span>.\"</p>" +
						"<p><b>The above text is displayed as:</b></p>" +
						"<p>\"Hi <span style=\"color:blue;\">Tyler</span>, I really appreciate your business and would love for you to share you experience. Your friends and family will also have a great experience at <span style=\"color:blue;\">Yaptive</span> with <span style=\"color:blue;\">Daniel</span>.\"</p>"
				)
			}

			init()
		},
	}
}
