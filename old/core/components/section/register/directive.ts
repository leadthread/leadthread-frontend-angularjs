namespace lt {

	interface ISectionRegisterScope {
		options: ISiteOptions
		controls: IPopupField[]
		referrals: IContact[]
		referrals_sent: IContact[]
		referralsLoading: Function
		title: ISection
		send: Function
		submit: Function
		link: Link
		registerForm: ng.IFormController
		getSectionStyle: Function
	}

	angular.module("lt.core").directive("sectionRegister", ["$device", "$http", "$q", "$sms", "$popup", "$timeout", "$localStorage", "EventService", function ($device: IDeviceService, $http: ng.IHttpService, $q: ng.IQService, $sms: ISmsService, $popup: IPopupService, $timeout: ng.ITimeoutService, $localStorage: IStorageService, EventService: EventService): any {
		"use strict";

		return {
			restrict: "A",
			templateUrl: "components/section/register/index.html",
			scope: {
				model: "=sectionRegister",
				options: "=",
			},
			link: function ($scope: ISectionRegisterScope, $el) {

				function init() {
					$scope.controls = getControls();
					$scope.link = _.get<Link>($scope, "options.link");

					//Functions
					$scope.submit = submit;
					$scope.getSectionStyle = getSectionStyle;

					defineListeners();
				}

				function defineListeners() {

				}

				function getControls(): IPopupField[] {
					let controls: IPopupField[] = [];

					controls.push({ type: "input", subtype: "text", label: "Your First Name", key: "first_name", value: null, required: true });
					controls.push({ type: "input", subtype: "text", label: "Your Last Name", key: "last_name", value: null, required: true });
					controls.push({ type: "input", subtype: "tel", label: "Your Mobile Number", key: "phone", value: null, required: true });
					controls.push({ type: "input", subtype: "email", label: "Your Email (Optional)", key: "email", value: null, required: false });

					return controls;
				}

				function submit(valid) {
					if (valid) {
						let data: any = _.reduce<IPopupField, IContact>($scope.controls, (carry: IContact, control: IPopupField) => {
							carry[control.key] = control.value;
							return carry;
						}, {} as IContact);

						data = _.merge(data, {
							user_id: _.get($scope, "options.link.user_id"),
							company_id: _.get($scope, "options.link.company_id"),
							campaign_id: _.get($scope, "options.link.campaign_id"),
							sent_via: _.get($scope, "options.link.sent_via"),
						});
		
						let promise = $http({"method":"POST", "url":"/api/v1/links/contact", "data": data}).then(function (x: ng.IHttpPromiseCallbackArg<IApiItemResponse<ILink>>) {
							return x.data.data;
						})
	
						return $popup.while(promise, "Almost Done...").then(() => {
							return promise
						}).then(redirect);
					}
				}

				function redirect(link: ILink) {
					window.location.href = link.long_url + "#?page=0&scrollTo=share_title";
				}

				function getSectionStyle(section: ISection): IStyle {
					let style: IStyle,
						padding_vertical: number;

					style = {
						"background": section.background_color,
						"color": section.font_color,
						"font-size": section.font_size + "px",
						"text-align": section.text_align
					};

					return style;
				}

				init();
			}
		};
	}]);
}