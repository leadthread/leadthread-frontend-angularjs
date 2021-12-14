import _ from "lodash"

class HtmlTitleService {
	static $inject = ["$transitions", "$state", "$window"]
	constructor($transitions, $state, $window) {
		this.$window.document.title = ""

		this.$transitions.onEnter({}, (trans) => {
			this.setTitle(this.getStateTitle(trans.to()))
		})

		this.resetTitle()
	}

	getCurrentStateTitle() {
		return this.getStateTitle(this.$state.current)
	}

	getStateTitle(state) {
		var x = state.title
		if (!x && !_.isString(x) && state.name !== "") {
			console.warn(
				"A title must be set for this route! (" + state.name + ")"
			)
			x = "Yaptive"
		}
		return x
	}

	getTitle() {
		return this.$window.document.title
	}

	setTitle(newTitle) {
		this.$window.document.title = newTitle
	}

	resetTitle() {
		this.setTitle(this.getCurrentStateTitle())
	}
}

export const key = "$title"
export const inject = []
export const fn = HtmlTitleService
