/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-17 15:30:35
*/
namespace lt {
	export class CampaignForm implements ICampaignForm {
		public type: string;
		public version: number;
		public form: ICampaignFormForm;

		constructor(protected service: CampaignFormService, protected data: ICampaignForm) {}

		setFieldValue(name: string, value: any) {
			let field = this.getField(name);

			if (field) {
				field.value = value;
			}
		}

		getFieldValue(name: string): any {
			let field = this.getField(name);
			return _.get(field, "value", null);
		}

		getField(name: string): ICampaignFormField {
			let form = this.getForm();
			let field: ICampaignFormField = null;
			_.forEach(form, (groups) => {
				_.forEach(groups, (subGroup) => {
					_.forEach(subGroup.questions, (sField) => {
						if (!field && sField.name === name) {
							field = sField;
						}
					});
				});
			});

			if(!field) {
				console.warn("Could not find the field named: '"+name+"' in the form", form);
			}

			return field;
		}

		getForm() {
			return this.build();
		}

		build(): ICampaignFormForm {
			return this.form || _.cloneDeep(<ICampaignFormForm>{});
		}

		getTableOfContents(): ICampaignFormTableOfContents {
			let self = this;
			let toc: ICampaignFormTableOfContents = {};

			_.forEach(this.form, (v, k) => {
				let group: ICampaignFormTableOfContentsItem[] = toc[k] = [];

				_.forEach(v, (v, key) => {
					group.push({name: key, group:k, show: true, done: this.isSubGroupDone(v)});
				});
			});

			return toc;
		}

		isSubGroupDone (group: ICampaignFormSubGroup) {
			let self = this;
			let done = true;
			_.forEach(group.questions, function (q) {
				done = done && self.isFieldComplete(q);
			});
			return done;
		}

		isFieldComplete (question: ICampaignFormField) {
			let done = true;
			let required = this.isQuestionRequired(question);
			let valid = this.isQuestionValid(question);
			
			if (required && !valid) {
				done = false;
			}
			
			return done;
		}

		isFieldEnabled (question: ICampaignFormField): boolean {
			let depends;

			if (question.depend) {
				let show = true;
				if (!_.isArray(question.depend)) {
					depends = [question.depend];
				} else {
					depends = question.depend;
				}
				_.forEach(depends, (depend: any) => {
					_.forEach(this.form, (x) => {
						_.forEach(x, (y) => {
							_.forEach(y.questions, (z) => {
								if(depend.name === z.name) {
									if (depend.value === z.value) {
										show = show && true;
									} else if (depend.value !== z.value) {
										show = show && false;
									}
								}
							});
						});
					});
				});

				question.show = show;
			}

			return question.show;
		}

		isQuestionRequired (question: ICampaignFormField) {
			return !!(_.isFunction(question.required) ? question.required() : question.required);
		}

		isQuestionValid (question: ICampaignFormField) {
			return _.isFunction(question.valid) ? question.valid() : question.valid;
		}

		isValid () {
			let isValid = true, self = this;

			_.forEach(this.form, function (group) {
				_.forEach(group, function (subGroup) {
					_.forEach(subGroup.questions, function (question) {
						if (self.isFieldEnabled(question)) {
							isValid = isValid && self.isFieldComplete(question);
						}
					});
				});
			});

			return isValid;
		}

		protected brandingQuestions: ICampaignFormField[] = [
			{
				name:"campaignName",
				displayName:"Campaign Name",
				description:"",
				value:"",
				type:"text",
				required: true,
				valid: function () {
					return _.isString(this.value) && this.value.length > 3;
				},
				show:true
			},{
				name:"campaignKeyword",
				displayName:"Campaign Keyword",
				description:"",
				value:null,
				type:"keyword",
				show:true,
				valid: function () {
					return _.isString(this.value) && this.value.length > 3;
				},
				required: false,
			},{
				name:"campaignBrand",
				displayName:"Brand for Campaign",
				description:"",
				value:null,
				type:"brand",
				show:true,
				options: {
					brands: [],
					onBrandChange: null,
				},
				valid: function () {
					return this.value instanceof Brand && _.isInteger(this.value.id);
				},
				required: function () {
					return true;
				},
			}
		];
	}

	export class CampaignFormFactory {
		static $inject: string[] = ["CampaignFormService"];
		constructor(protected service: CampaignFormService) {}
		create(data: ICampaignForm): CampaignForm {
			let forms: {[type: string]: {[version: number]: typeof CampaignForm}} = {
				"referral-thread": {
					1: V1ReferralThreadCampaignForm,
					2: V2ReferralThreadCampaignForm,
				},
				"message-thread": {
					1: V1MessageThreadCampaignForm,
				},
				"reach": {
					1: V1ReachCampaignForm,
				},
				"recognition": {
					1: V1RecognitionCampaignForm,
				},
				"review": {
					1: V1ReviewCampaignForm,
				},
				"testimonial-thread": {
					1: V1TestimonialThreadCampaignForm,
					2: V2TestimonialThreadCampaignForm,
				},
				"leaderboard": {
					2: V2LeaderboardCampaignForm,
				}
			};

			let form: typeof CampaignForm = _.get(forms, data.type+"."+data.version, null);

			if(form) {
				return new form(this.service, data);
			}
			throw "Unknown type for CampaignForm: "+_.get(data, "type", "null")+" version "+_.get(data, "version", "null");
		}
	}

	export class CampaignFormService {
		static $inject: string[] = [];
		constructor() {}
	}

	angular.module("lt.app").service("CampaignFormService", CampaignFormService); 
	angular.module("lt.app").service("CampaignFormFactory", CampaignFormFactory); 
}