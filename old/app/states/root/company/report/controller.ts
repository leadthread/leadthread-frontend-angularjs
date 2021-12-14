namespace lt {
	interface IReportControllerScope {
		companyId: number;
		perPage: 20;
		tabs: ITab[];
		selected: ISelectedFilters;
		report: IReport;
		controls: IControl[];
		users: IUser[];
		campaigns: ICampaign[];
		$watch: any;
	}

	interface ITab {
		name: string;
		state: string;
	}

	interface ISelectedFilters {
		[key: string]: string|number;
	}

	interface IReport {
		activeTab: number;
		buildReportUrl: Function;
		data: _.Dictionary<any>[];
		doCellAction: Function;
		getCellValue: Function;
		getParamsString: Function;
		getReportUrlParts: Function;
		getSumOfColumn: Function;
		hasCellAction: Function;
		getNameForColumn: Function;
		fixColumnName: Function;
		isCellVisible: Function;
		load: Function;
		reset: Function;
		setSelectedFromStateParams: Function;
		setTabByState: Function;
		showSums: boolean;
		url: string;
		columns: string[];
		filtersOpen: boolean;
	}

	interface IControlDate extends IControl {
		opened: boolean;
		toggle: Function,
		options: _.Dictionary<any>
	}

	interface IControl {
		id: string;
		name: string;
		type: string;
		enabled: boolean;
		order: number;
		options?: any;
		view: boolean;
		include: boolean;
	}

	interface IRecord {
		date: string;
		contact_id: string;
		user_id: number;
		recipient_id: number;
		campaign_id: number;
		sent_via: string;
		consent: string;
		opened: boolean;
		// data: any;
	}

	angular.module("lt.app").controller("ReportController", [ "$cache", "$http", "$location", "$q", "$scope", "$state", "$stateParams",  "campaigns", "company_id", "titleCaseFilter", "users", function ($cache: ICacheService, $http: ng.IHttpService, $location: ng.ILocationService, $q: ng.IQService, $scope: IReportControllerScope, $state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService, campaigns: Campaign[], company_id: number, titleCaseFilter, users: IUser[]) {
		"use strict";

		/**
		 * Start it up
		 */
		function init () {
			defineScope();
			defineListeners();
		}

		var defineScope = function () {
			$scope.companyId = company_id;

			$scope.perPage = 20;
			$scope.selected = {};
			$scope.tabs = [
				{name: "Campaign", state: "root.company.report.campaign"},
				{name: "User", state: "root.company.report.user"},
				// {name: "Contact", state: "root.company.report.contact"}, // Uncomment to add the contact report tab back
				{name: "Recipient", state: "root.company.report.recipient"},
			];
			$scope.report = {
				activeTab: null,
				buildReportUrl: buildReportUrl,
				data: null,
				doCellAction: doCellAction,
				getCellValue: getCellValue,
				getParamsString: getParamsString,
				getReportUrlParts: getReportUrlParts,
				getSumOfColumn: getSumOfColumn,
				hasCellAction: hasCellAction,
				isCellVisible: isCellVisible,
				getNameForColumn: getNameForColumn,
				fixColumnName: fixColumnName,
				load: load,
				reset: reset,
				setSelectedFromStateParams: setSelectedFromStateParams,
				setTabByState: setTabByState,
				showSums: false,
				url: null,
				columns: [],
				filtersOpen: false,
			};
			$scope.controls = [
				{order: 0, include: null, view: false, id: "campaign", name: "Campaign", type: "group", enabled: false},
				{order: 0, include: null, view: false, id: "user", name: "User", type: "group", enabled: false},
				{order: 0, include: null, view: false, id: "contact", name: "Contact", type: "group", enabled: false},
				{order: 0, include: null, view: false, id: "recipient", name: "Recipient", type: "group", enabled: false},
				{order: 0, include: null, view: false, id: "recipient_phone", name: "Recipient Phone", type: "group", enabled: false},
				{order: 0, include: null, view: false, id: "recipient_email", name: "Recipient Email", type: "group", enabled: false},
				{order: 1, include: null, view: false, id: "campaign_id", name: "Campaign", type: "campaign", enabled: false},
				{order: 2, include: null, view: false, id: "campaign_type", name: "Campaign Type", type: "campaign_type", enabled: false, options: [
					{value:"referral-thread", key:"ReferralThread"},
					{value:"leaderboard", key:"Leaderboard"},
					{value:"message-thread", key:"MessageThread"},
					{value:"testimonial-thread", key:"TestimonialThread"},
					{value:"reach", key:"Reach"},
					{value:"recognition", key:"Recognition"},
					{value:"review", key:"Review"},
				]},
				{order: 3, include: null, view: false, id: "user_id", name: "User", type: "user", enabled: false},
				{order: 4, include: null, view: false, id: "contact_id", name: "Contact", type: "contact", enabled: false},
				{order: 5, include: null, view: false, id: "recipient_id", name: "Recipient", type: "recipient", enabled: false},
				{order: 6, include: null, view: false, id: "consent", name: "Opt In", type: "boolean", enabled: false},
				{order: 6, include: null, view: false, id: "contact_sent", name: "Sent", type: "boolean", enabled: false},
				{order: 6, include: null, view: false, id: "contact_opened", name: "Contact Opens", type: "boolean", enabled: false},
				{order: 7, include: null, view: false, id: "contact_incentive_views", name: "Contact Incentive Views", type: "boolean", enabled: false},
				{order: 7, include: null, view: false, id: "contact_incentive_views", name: "Contact Incentive Views", type: "boolean", enabled: false},
				{order: 7, include: null, view: false, id: "contact_shares", name: "Contact Shares", type: "boolean", enabled: false},
				{order: 8, include: null, view: false, id: "recipient_opens", name: "Recipient Views", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_watched_video", name: "Recipient Watched Video", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_clicked_total", name: "Recipient Action Clicks", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_clicked_call", name: "Recipient Clicked Call", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_clicked_email", name: "Recipient Clicked Email", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_clicked_register", name: "Recipient Clicked Register", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_clicked_sms", name: "Recipient Clicked Sms", type: "boolean", enabled: false},
				{order: 9, include: null, view: false, id: "recipient_clicked_url", name: "Recipient Clicked Url", type: "boolean", enabled: false},
				// {order: 9, include: null, view: false, id: "recipient_is_lead", name: "Referral", type: "boolean", enabled: false },
				// {order: 9, include: null, view: false, id: "recipient_is_lead_total", name: "Referrals", type: "boolean", enabled: false},
				// {order: 9, include: null, view: false, id: "recipient_is_relevant", name: "Referral", type: "boolean", enabled: false },
				{order: 10, include: null, view: false, id: "download", name: "Export", type: "download", enabled: false},
			];

			$scope.controls.push(<IControlDate>{
				order: -1,
				id: "date", name: "Date",
				type: "date",
				enabled: false,
				opened: false,
				view: true,
				include: null,
				toggle: function () {
					this.opened = !this.opened;
				},
				options: {
					dateDisabled: false,
					formatYear: 'yy',
					startingDay: 1
				}
			});

			var t = $scope.selected.campaign_type;
			$scope.users = users;
			$scope.campaigns = t ? _.filter(campaigns, {type: t}) : campaigns;
		};

		var defineListeners = function () {
			// Watch all controls except a few
			_.forEach($scope.controls, (control) => {
				if(!_.includes(["date", "campaign_type"], control.id)) {
					watchSelected(control.id);
				}
			});

			// Watch specific controls
			watchSelected("campaign_type", function (n) {
				$location.search("campaign_type", n);
				$location.search("campaign_id", null);
			});
			watchSelected("date", function () {
				$location.search("date", getSelectedDateString());
			});

			// Change the tab
			$scope.$watch("report.activeTab", function (n:string, o: string) {
				if(_.isNumber(n) && n!==o && n>=0) {
					$state.go($scope.tabs[n].state, {}, {inherit: true});
				}
			});
		};

		var watchSelected = function (key: string, cb: (n: any, o: any) => void = null) {
			$scope.$watch("selected."+key, function (n: any, o: any) {
				if (n!==o) {
					if (_.isFunction(cb)) {
						cb(n, o);
					} else {
						if(n===null) {
							$location.search(key, undefined);
						} else {
							$location.search(key, n);
						}
					}
				}
			});
		};

		var setTabByState = function () {
			$scope.report.activeTab = _.findIndex($scope.tabs, {state: $state.current.name});
		};

		var getSelectedDateString = function () {
			var n = $scope.selected.date;
			return n ? moment(n).format("Y-M-D") : n;
		};

		var getParamsString = function () {
			let params = _.reduce($scope.controls, (carry: _.Dictionary<string|number>[], control: IControl) => {
				if (control.view || control.include) {
					let value;
					switch (control.id) {
						case "date":
							value = getSelectedDateString();
							break;
						default:
							value = _.get($scope.selected, control.id, null);
							break;
					}

					carry.push({key: control.id, value: value});
				}
				return carry;
			}, [
				{key: "company_id", value: $scope.companyId},
			]);

			return _(params).map((item) => {
				if(item.value === null) {
					return item.key;
				} else {
					return item.key+"="+encodeURIComponent(item.value+"");
				}
			}).join("&");
		};

		var doCellAction = function (column: string, record: IRecord) {
			switch(column) {
				case "date":
					return $state.go(".", {date: record.date}, {inherit: true});
				case "user":
					return $state.go(".", {user_id: record.user_id}, {inherit: true});
				case "recipient_is_lead_total":
					let params: any = {date: record.date, recipient_is_lead: "yes"};
					if(record.user_id) {
						params.user_id = record.user_id;
					}
					return $state.go("^.recipient", params, {inherit: true});
				case "campaign":
					return $state.go(".", {campaign_id: record.campaign_id}, {inherit: true});
				case "recipient":
					return $state.go("root.company.referral", {referralId: record.recipient_id}, {inherit: true});
				case "contact":
					return $state.go("root.company.contact", {contactId: record.contact_id}, {inherit: true});

				// case "contact_sent":
				// 	return $state.go("^.contact", {date: record.date, user_id: record.user_id, campaign_id: record.campaign_id, consent: null, opened: null}, {inherit: true});
				// case "contact_opened":
				// 	return $state.go("^.contact", {date: record.date, user_id: record.user_id, campaign_id: record.campaign_id, consent: null, opened: "yes"}, {inherit: true});
				// case "contact_opt_out":
				// 	return $state.go("^.contact", {date: record.date, user_id: record.user_id, campaign_id: record.campaign_id, consent: "no", opened: null}, {inherit: true});
				// case "contact_opt_in":
				// 	return $state.go("^.contact", {date: record.date, user_id: record.user_id, campaign_id: record.campaign_id, consent: "yes", opened: null}, {inherit: true});
				// case "social_shares":
				// 	return $state.go("^.social", {date: record.date, user_id: record.user_id, campaign_id: record.campaign_id}, {inherit: true});
				// case "contact_opened":
				// 	return $state.go(".", {contact_opened: record.contact_opened}, {inherit: true});
				// case "consent":
				// 	return $state.go(".", {consent: record.consent}, {inherit: true});
			}
		};

		var hasCellAction = function (column: string, record: IRecord) {
			var cells = [
				"date",
				"user",
				"campaign",
				"recipient_is_lead_total",
				"recipient",
				"contact",
				// "recipient_is_lead",
				// "contact_opened",
				// "contact_opt_in",
				// "contact_opt_out",
				// "contact_sent",
				// "consent",
				// "opened",
				// "opens",
				// "opt_in",
				// "opt_out",
				// "referrals_provided",
				// "sent",
				// "sent_via",
				// "social_shares",
			];

			if (column === "contact" && record[column] === "") {
				return false;
			}

			if (column === "recipient" && record[column] === "") {
				return false;
			}

			return _.indexOf(cells, column) >= 0;
		};

		var isCellVisible = function (column: string) {
			return _.indexOf(["recipient_id", "contact_id", "user_id", "campaign_id", "recipient_is_relevant"], column) < 0;
		};

		var getSumOfColumn = function (column: string) {
			if (column === "date") {
				return "Total";
			}
			if (_.indexOf(["recipient_is_lead", "recipient_phone", "recipient_email", "campaign", "contact", "user", "recipient", "sent_via"], column) >= 0) {
				return "";
			}
			return _.sumBy($scope.report.data, column);
		};

		var reset = function () {
			for (var prop in $scope.selected) {
				let n: _.Dictionary<any> = $scope.selected;
				n[prop] = undefined;
			}
		};

		var load = function () {
			var url = buildReportUrl();
			$scope.report.url = url;
			$scope.report.data = null;
			var x = $cache.remember(url, 10, function () {
				return $http.get(url).then(function (resp) {
					return resp.data.data;
				});
			}).then(function (resp: _.Dictionary<any>[]) {
				if(url === $scope.report.url) {
					$scope.report.data = resp;
					$scope.report.columns = _.keys(_.first(resp));
				}
			});

			return x;
		};

		var buildReportUrl = function (download: string = null) {
			var params = $scope.report.getParamsString();

			var parts = $scope.report.getReportUrlParts();

			if (download) {
				parts.push(download);
			}

			return parts.join("/") + (params ? "?"+params : "");
		};

		var setSelectedFromStateParams = function () {
			_.forEach($scope.controls, (control) => {
				if(control.id === "date") {
					$scope.selected[control.id] = $state.params.date ? moment($state.params.date, "Y-M-D").toDate() : null;
				} else {
					$scope.selected[control.id] = $state.params[control.id];
				}
			})
		};

		var getReportUrlParts = function (): string[] {
			return [];
		};

		var getCellValue = function (column: string, record: IRecord) {
			var r: _.Dictionary<any> = record;
			var x = r[column];
			switch (column) {
				case "recipient":
					return x === "" ? "PROSPECT" : titleCaseFilter(x);
				case "contact":
					return x === "" ? "N/A" : titleCaseFilter(x);
				case "email":
				case "recipient_email":
				case "contact_email":
				case "date":
					return x;
				case "recipient_is_lead":
					return x ? "Yes" : "No";
				case "phone":
				case "recipient_phone":
				case "contact_phone":
					return x ? (new Telephone(x)).toPretty() : x;
				default:
					return titleCaseFilter(x);
			}
		};

		var getNameForColumn = function (column: string): string {
			return _.get(_.find($scope.controls, {id: column}), "name", column);
		}

		var fixColumnName = function (column: string): string {
			return this.getNameForColumn(column);
		}

		init();
	}]);
}