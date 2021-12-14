/* eslint-disable indent */
import angular from "angular"

var TextInsertService = function () {}

/**
 * Inserts text into an element at its cursor location
 * @param  {HTMLElement} $el  The input element
 * @param  {String}      text The text to insert
 * @return {String|void}
 */
TextInsertService.prototype.insert = function ($el, text) {
	var back, browser, front, pos, range, scrollPos
	if (!$el) {
		return
	}
	scrollPos = $el.scrollTop
	pos = 0
	browser =
		$el.selectionStart || $el.selectionStart === "0"
			? "ff"
			: document.selection
			? "ie"
			: false
	if (browser === "ie") {
		$el.focus()
		range = document.selection.createRange()
		range.moveStart("character", -$el.value.length)
		pos = range.text.length
	} else if (browser === "ff") {
		pos = $el.selectionStart
	}
	front = $el.value.substring(0, pos)
	back = $el.value.substring(pos, $el.value.length)
	$el.value = front + text + back
	pos = pos + text.length
	if (browser === "ie") {
		$el.focus()
		range = document.selection.createRange()
		range.moveStart("character", -$el.value.length)
		range.moveStart("character", pos)
		range.moveEnd("character", 0)
		range.select()
	} else if (browser === "ff") {
		$el.selectionStart = pos
		$el.selectionEnd = pos
		$el.focus()
	}
	$el.scrollTop = scrollPos
	angular.element($el).trigger("input")
	return ""
}

export const key = "$textInsert"
export const inject = []
export const fn = TextInsertService
