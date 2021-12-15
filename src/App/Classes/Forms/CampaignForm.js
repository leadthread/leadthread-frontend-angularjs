import _ from "lodash"

import { BrandClass as Brand } from "../../../Core/Classes"

export class CampaignForm {
	type
	version
	form

	constructor(service, data) {}

	setFieldValue(name, value) {
		let field = this.getField(name)

		if (field) {
			field.value = value
		}
	}

	getFieldValue(name) {
		let field = this.getField(name)
		return _.get(field, "value", null)
	}

	getField(name) {
		let form = this.getForm()
		let field = null
		_.forEach(form, (groups) => {
			_.forEach(groups, (subGroup) => {
				_.forEach(subGroup.questions, (sField) => {
					if (!field && sField.name === name) {
						field = sField
					}
				})
			})
		})

		if (!field) {
			console.warn(
				"Could not find the field named: '" + name + "' in the form",
				form
			)
		}

		return field
	}

	getForm() {
		return this.build()
	}

	build() {
		return this.form || _.cloneDeep({})
	}

	getTableOfContents() {
		let self = this
		let toc = {}

		_.forEach(this.form, (v, k) => {
			let group = (toc[k] = [])

			_.forEach(v, (v, key) => {
				group.push({
					name: key,
					group: k,
					show: true,
					done: this.isSubGroupDone(v),
				})
			})
		})

		return toc
	}

	isSubGroupDone(group) {
		let self = this
		let done = true
		_.forEach(group.questions, function (q) {
			done = done && self.isFieldComplete(q)
		})
		return done
	}

	isFieldComplete(question) {
		let done = true
		let required = this.isQuestionRequired(question)
		let valid = this.isQuestionValid(question)

		if (required && !valid) {
			done = false
		}

		return done
	}

	isFieldEnabled(question) {
		let depends

		if (question.depend) {
			let show = true
			if (!_.isArray(question.depend)) {
				depends = [question.depend]
			} else {
				depends = question.depend
			}
			_.forEach(depends, (depend) => {
				_.forEach(this.form, (x) => {
					_.forEach(x, (y) => {
						_.forEach(y.questions, (z) => {
							if (depend.name === z.name) {
								if (depend.value === z.value) {
									show = show && true
								} else if (depend.value !== z.value) {
									show = show && false
								}
							}
						})
					})
				})
			})

			question.show = show
		}

		return question.show
	}

	isQuestionRequired(question) {
		return !!(_.isFunction(question.required)
			? question.required()
			: question.required)
	}

	isQuestionValid(question) {
		return _.isFunction(question.valid) ? question.valid() : question.valid
	}

	isValid() {
		let isValid = true,
			self = this

		_.forEach(this.form, function (group) {
			_.forEach(group, function (subGroup) {
				_.forEach(subGroup.questions, function (question) {
					if (self.isFieldEnabled(question)) {
						isValid = isValid && self.isFieldComplete(question)
					}
				})
			})
		})

		return isValid
	}

	brandingQuestions = [
		{
			name: "campaignName",
			displayName: "Campaign Name",
			description: "",
			value: "",
			type: "text",
			required: true,
			valid: function () {
				return _.isString(this.value) && this.value.length > 3
			},
			show: true,
		},
		{
			name: "campaignKeyword",
			displayName: "Campaign Keyword",
			description: "",
			value: null,
			type: "keyword",
			show: true,
			valid: function () {
				return _.isString(this.value) && this.value.length > 3
			},
			required: false,
		},
		{
			name: "campaignBrand",
			displayName: "Brand for Campaign",
			description: "",
			value: null,
			type: "brand",
			show: true,
			options: {
				brands: [],
				onBrandChange: null,
			},
			valid: function () {
				return this.value instanceof Brand && _.isInteger(this.value.id)
			},
			required: function () {
				return true
			},
		},
	]
}
