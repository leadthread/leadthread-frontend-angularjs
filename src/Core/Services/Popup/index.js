import _ from "lodash"

var PopupService = function ($uibModal, $q) {
	this.$uibModal = $uibModal
	this.$q = $q
}

// $popup.form([
// 	{type: "input", subtype: "text", label: "First Name", key: 'last_name', value: data.first_name, required: true},
// 	{type: "input", subtype: "text", label: "Last Name",  key: 'first_name', value: data.last_name,  required: true},
// ], "Who is this?");
// $popup.input(data.phone, "What is the phone number?");
// $popup.textarea(data.phone, "What is the phone number?");

// $popup.delay(5000, "Hold on...");

PopupService.prototype.form = function (
	form,
	prompt,
	showCopyPasteHelper,
	size
) {
	return this.openFormModal(
		{
			form: form,
			prompt: prompt,
			type: "form",
			_showCopyPasteHelper: showCopyPasteHelper,
		},
		size
	)
}

/**
 * Creates a form as a popup
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @param  {string}		type      type of form element [input, textarea, select]
 * @param  {string}		subtype   sub-type of form element [text, tel, null]
 * @param  {array}		choices   choices for element responses
 * @param  {array}		headers   headers for each choice
 * @param  {integer}	minlength minimum character length of value
 * @param  {integer}	maxlength maximum character length of value
 */
PopupService.prototype.single = function (
	key,
	value,
	prompt,
	label,
	type,
	subtype,
	choices,
	headers,
	minlength,
	maxlength
) {
	return this.form(
		[
			{
				type: type,
				subtype: subtype,
				label: label,
				key: key,
				value: value,
				required: true,
				choices: choices,
				headers: headers,
				minlength: minlength,
				maxlength: maxlength,
			},
		],
		prompt
	)
}

/**
 * Creates an input[text] form as a popup
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @param  {integer}	minlength minimum character length of value
 * @param  {integer}	maxlength maximum character length of value
 */
PopupService.prototype.input = function (
	key,
	value,
	prompt,
	label,
	minlength,
	maxlength
) {
	return this.single(
		key,
		value,
		prompt,
		label,
		"input",
		"text",
		null,
		null,
		minlength,
		maxlength
	)
}

/**
 * Creates an input[checkbox] form as a popup
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @param  {integer}	minlength minimum character length of value
 * @param  {integer}	maxlength maximum character length of value
 */
PopupService.prototype.checkbox = function (key, value, prompt, label) {
	return this.single(
		key,
		value,
		prompt,
		label,
		"input",
		"checkbox",
		null,
		null,
		null,
		null
	)
}

/**
 * Creates an input[tel] form as a popup
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @return {[type]}               [description]
 */
PopupService.prototype.tel = function (key, value, prompt, label) {
	return this.single(key, value, prompt, label, "input", "tel")
}

/**
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @param  {integer}	minlength minimum character length of value
 * @param  {integer}	maxlength maximum character length of value
 */
PopupService.prototype.textarea = function (
	key,
	value,
	prompt,
	label,
	minlength,
	maxlength
) {
	return this.single(
		key,
		value,
		prompt,
		label,
		"textarea",
		null,
		null,
		null,
		minlength,
		maxlength
	)
}

/**
 * [select description]
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @param  {array}		choices   choices for element responses
 * @return {[type]}         [description]
 */
PopupService.prototype.select = function (key, value, prompt, label, choices) {
	return this.single(key, value, prompt, label, "select", null, choices)
}

/**
 * @param  {string}		key       key for the value that the form returns
 * @param  {mixed}		value     default value that the form returns
 * @param  {string}		prompt    prompt displayed at the heading of the popup
 * @param  {string}		label     label for question
 * @param  {integer}	minlength minimum character length of value
 * @param  {integer}	maxlength maximum character length of value
 */
PopupService.prototype.contact = function (key, value, prompt, label, choices) {
	return this.single(key, value, prompt, label, "contact", null, choices)
}

PopupService.prototype.info = function (prompt, text, buttonText) {
	return this.openFormModal({
		text: text,
		prompt: prompt,
		type: "info",
		buttonText: buttonText,
	})
}

PopupService.prototype.decide = function (prompt, text) {
	return this.openFormModal({
		text: text,
		prompt: prompt,
		type: "decide",
	})
}

PopupService.prototype.delay = function (timeout, prompt) {
	return this.openFormModal({
		timeout: timeout,
		prompt: prompt,
		type: "delay",
	})
}

// $popup.while(promise, "Loading...");
PopupService.prototype.while = function (promise, prompt) {
	return this.openFormModal({
		promise: promise,
		prompt: prompt,
		type: "while",
	})
}

PopupService.prototype.contacts = function (contacts) {
	return this.openContactsModal({ contacts: _.cloneDeep(contacts) })
}

PopupService.prototype.copy = function (model, targets, target) {
	return this.openCopyModal({
		model: model,
		targets: targets,
		target: target || null,
	})
}

PopupService.prototype.incentive = function (incentive) {
	return this.openIncentiveModal({ incentive: incentive })
}

PopupService.prototype.sendPlaylist = function (data) {
	return this.openSendPlaylistModal(data)
}

PopupService.prototype.sendCampaign = function (data) {
	return this.openSendCampaignModal(data)
}

PopupService.prototype.openFormModal = function (data, size) {
	return this.openModal(
		{
			controller: "PopupController",
			templateUrl: "templates/popup/popup.html",
		},
		data,
		size
	)
}

PopupService.prototype.openCopyModal = function (data, size) {
	return this.openModal(
		{
			controller: "PopupCopyController",
			templateUrl: "templates/popup/copy.html",
		},
		data,
		size
	)
}

PopupService.prototype.openContactsModal = function (data) {
	return this.openModal(
		{
			controller: "PopupContactsController",
			templateUrl: "templates/popup/contacts.html",
		},
		data
	)
}

PopupService.prototype.openIncentiveModal = function (data) {
	return this.openModal(
		{
			controller: "PopupIncentiveController",
			templateUrl: "templates/popup/incentive.html",
		},
		data
	)
}

PopupService.prototype.openPlaylistSchedulesModal = function (data) {
	return this.openModal(
		{
			controller: "PopupPlaylistSchedulesController",
			templateUrl: "templates/popup/schedules.html",
		},
		data,
		"sm"
	)
}

PopupService.prototype.openSendPlaylistModal = function (data) {
	return this.openModal(
		{
			controller: "PopupSendPlaylistController",
			templateUrl: "templates/popup/send.playlist.html",
		},
		data,
		"lg"
	)
}

PopupService.prototype.openSendCampaignModal = function (data) {
	return this.openModal(
		{
			controller: "PopupSendCampaignController",
			templateUrl: "templates/popup/send.campaign.html",
		},
		data,
		"lg"
	)
}

PopupService.prototype.openModal = function (options, data, size) {
	data = data || {}
	size = size || "sm"
	var defaults = {
		controller: "PopupController",
		animation: false,
		templateUrl: "templates/popup/index.html",
		windowTemplateUrl: "templates/popup/window.html",
		size: size,
		resolve: {
			options: [
				function () {
					return data
				},
			],
		},
	}
	var x = this.$uibModal.open(_.merge(defaults, options))
	return x.result
}

export const key = "$popup"
export const inject = ["$uibModal", "$q"]
export const fn = PopupService
