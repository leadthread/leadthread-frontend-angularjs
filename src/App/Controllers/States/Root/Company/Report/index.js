import moment from "moment"
import _ from "lodash"
import { TelephoneClass as Telephone } from "../../../../../../Core/Classes"

export * from "./Campaign"
export * from "./Contact"
export * from "./Recipient"
export * from "./User"

const key = "ReportController"
const inject = [
	"$cache",
	"$http",
	"$location",
	"$q",
	"$scope",
	"$state",
	"$stateParams",
	"campaigns",
	"company_id",
	"titleCaseFilter",
	"users",
]
function fn(
	$cache,
	$http,
	$location,
	$q,
	$scope,
	$state,
	$stateParams,
	campaigns,
	company_id,
	titleCaseFilter,
	users
) {
	/**
	 * Start it up
	 */
	function init() {
		defineScope()
		defineListeners()
	}

	var defineScope = function () {
		$scope.companyId = company_id

		$scope.perPage = 20
		$scope.selected = {}
		$scope.tabs = [
			{ name: "Campaign", state: "root.company.report.campaign" },
			{ name: "User", state: "root.company.report.user" },
			// {name: "Contact", state: "root.company.report.contact"}, // Uncomment to add the contact report tab back
			{ name: "Recipient", state: "root.company.report.recipient" },
		]
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
		}
		$scope.controls = [
			{
				order: 0,
				include: null,
				view: false,
				id: "campaign",
				name: "Campaign",
				type: "group",
				enabled: false,
			},
			{
				order: 0,
				include: null,
				view: false,
				id: "user",
				name: "User",
				type: "group",
				enabled: false,
			},
			{
				order: 0,
				include: null,
				view: false,
				id: "contact",
				name: "Contact",
				type: "group",
				enabled: false,
			},
			{
				order: 0,
				include: null,
				view: false,
				id: "recipient",
				name: "Recipient",
				type: "group",
				enabled: false,
			},
			{
				order: 0,
				include: null,
				view: false,
				id: "recipient_phone",
				name: "Recipient Phone",
				type: "group",
				enabled: false,
			},
			{
				order: 0,
				include: null,
				view: false,
				id: "recipient_email",
				name: "Recipient Email",
				type: "group",
				enabled: false,
			},
			{
				order: 1,
				include: null,
				view: false,
				id: "campaign_id",
				name: "Campaign",
				type: "campaign",
				enabled: false,
			},
			{
				order: 2,
				include: null,
				view: false,
				id: "campaign_type",
				name: "Campaign Type",
				type: "campaign_type",
				enabled: false,
				options: [
					{ value: "referral-thread", key: "ReferralThread" },
					{ value: "leaderboard", key: "Leaderboard" },
					{ value: "message-thread", key: "MessageThread" },
					{
						value: "testimonial-thread",
						key: "TestimonialThread",
					},
					{ value: "reach", key: "Reach" },
					{ value: "recognition", key: "Recognition" },
					{ value: "review", key: "Review" },
				],
			},
			{
				order: 3,
				include: null,
				view: false,
				id: "user_id",
				name: "User",
				type: "user",
				enabled: false,
			},
			{
				order: 4,
				include: null,
				view: false,
				id: "contact_id",
				name: "Contact",
				type: "contact",
				enabled: false,
			},
			{
				order: 5,
				include: null,
				view: false,
				id: "recipient_id",
				name: "Recipient",
				type: "recipient",
				enabled: false,
			},
			{
				order: 6,
				include: null,
				view: false,
				id: "consent",
				name: "Opt In",
				type: "boolean",
				enabled: false,
			},
			{
				order: 6,
				include: null,
				view: false,
				id: "contact_sent",
				name: "Sent",
				type: "boolean",
				enabled: false,
			},
			{
				order: 6,
				include: null,
				view: false,
				id: "contact_opened",
				name: "Contact Opens",
				type: "boolean",
				enabled: false,
			},
			{
				order: 7,
				include: null,
				view: false,
				id: "contact_incentive_views",
				name: "Contact Incentive Views",
				type: "boolean",
				enabled: false,
			},
			{
				order: 7,
				include: null,
				view: false,
				id: "contact_incentive_views",
				name: "Contact Incentive Views",
				type: "boolean",
				enabled: false,
			},
			{
				order: 7,
				include: null,
				view: false,
				id: "contact_shares",
				name: "Contact Shares",
				type: "boolean",
				enabled: false,
			},
			{
				order: 8,
				include: null,
				view: false,
				id: "recipient_opens",
				name: "Recipient Views",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_watched_video",
				name: "Recipient Watched Video",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_clicked_total",
				name: "Recipient Action Clicks",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_clicked_call",
				name: "Recipient Clicked Call",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_clicked_email",
				name: "Recipient Clicked Email",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_clicked_register",
				name: "Recipient Clicked Register",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_clicked_sms",
				name: "Recipient Clicked Sms",
				type: "boolean",
				enabled: false,
			},
			{
				order: 9,
				include: null,
				view: false,
				id: "recipient_clicked_url",
				name: "Recipient Clicked Url",
				type: "boolean",
				enabled: false,
			},
			// {order: 9, include: null, view: false, id: "recipient_is_lead", name: "Referral", type: "boolean", enabled: false },
			// {order: 9, include: null, view: false, id: "recipient_is_lead_total", name: "Referrals", type: "boolean", enabled: false},
			// {order: 9, include: null, view: false, id: "recipient_is_relevant", name: "Referral", type: "boolean", enabled: false },
			{
				order: 10,
				include: null,
				view: false,
				id: "download",
				name: "Export",
				type: "download",
				enabled: false,
			},
		]

		$scope.controls.push({
			order: -1,
			id: "date",
			name: "Date",
			type: "date",
			enabled: false,
			opened: false,
			view: true,
			include: null,
			toggle: function () {
				this.opened = !this.opened
			},
			options: {
				dateDisabled: false,
				formatYear: "yy",
				startingDay: 1,
			},
		})

		var t = $scope.selected.campaign_type
		$scope.users = users
		$scope.campaigns = t ? _.filter(campaigns, { type: t }) : campaigns
	}

	var defineListeners = function () {
		// Watch all controls except a few
		_.forEach($scope.controls, (control) => {
			if (!_.includes(["date", "campaign_type"], control.id)) {
				watchSelected(control.id)
			}
		})

		// Watch specific controls
		watchSelected("campaign_type", function (n) {
			$location.search("campaign_type", n)
			$location.search("campaign_id", null)
		})
		watchSelected("date", function () {
			$location.search("date", getSelectedDateString())
		})

		// Change the tab
		$scope.$watch("report.activeTab", function (n, o) {
			if (_.isNumber(n) && n !== o && n >= 0) {
				$state.go($scope.tabs[n].state, {}, { inherit: true })
			}
		})
	}

	var watchSelected = function (key, cb = null) {
		$scope.$watch("selected." + key, function (n, o) {
			if (n !== o) {
				if (_.isFunction(cb)) {
					cb(n, o)
				} else {
					if (n === null) {
						$location.search(key, undefined)
					} else {
						$location.search(key, n)
					}
				}
			}
		})
	}

	var setTabByState = function () {
		$scope.report.activeTab = _.findIndex($scope.tabs, {
			state: $state.current.name,
		})
	}

	var getSelectedDateString = function () {
		var n = $scope.selected.date
		return n ? moment(n).format("Y-M-D") : n
	}

	var getParamsString = function () {
		let params = _.reduce(
			$scope.controls,
			(carry, control) => {
				if (control.view || control.include) {
					let value
					switch (control.id) {
						case "date":
							value = getSelectedDateString()
							break
						default:
							value = _.get($scope.selected, control.id, null)
							break
					}

					carry.push({ key: control.id, value: value })
				}
				return carry
			},
			[{ key: "company_id", value: $scope.companyId }]
		)

		return _(params)
			.map((item) => {
				if (item.value === null) {
					return item.key
				} else {
					return item.key + "=" + encodeURIComponent(item.value + "")
				}
			})
			.join("&")
	}

	var doCellAction = function (column, record) {
		let params = {}
		switch (column) {
			case "date":
				return $state.go(".", { date: record.date }, { inherit: true })
			case "user":
				return $state.go(
					".",
					{ user_id: record.user_id },
					{ inherit: true }
				)
			case "recipient_is_lead_total":
				params = { date: record.date, recipient_is_lead: "yes" }
				if (record.user_id) {
					params = { ...params, user_id: record.user_id }
				}
				return $state.go("^.recipient", params, { inherit: true })
			case "campaign":
				return $state.go(
					".",
					{ campaign_id: record.campaign_id },
					{ inherit: true }
				)
			case "recipient":
				return $state.go(
					"root.company.referral",
					{ referralId: record.recipient_id },
					{ inherit: true }
				)
			case "contact":
				return $state.go(
					"root.company.contact",
					{ contactId: record.contact_id },
					{ inherit: true }
				)

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
	}

	var hasCellAction = function (column, record) {
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
		]

		if (column === "contact" && record[column] === "") {
			return false
		}

		if (column === "recipient" && record[column] === "") {
			return false
		}

		return _.indexOf(cells, column) >= 0
	}

	var isCellVisible = function (column) {
		return (
			_.indexOf(
				[
					"recipient_id",
					"contact_id",
					"user_id",
					"campaign_id",
					"recipient_is_relevant",
				],
				column
			) < 0
		)
	}

	var getSumOfColumn = function (column) {
		if (column === "date") {
			return "Total"
		}
		if (
			_.indexOf(
				[
					"recipient_is_lead",
					"recipient_phone",
					"recipient_email",
					"campaign",
					"contact",
					"user",
					"recipient",
					"sent_via",
				],
				column
			) >= 0
		) {
			return ""
		}
		return _.sumBy($scope.report.data, column)
	}

	var reset = function () {
		for (var prop in $scope.selected) {
			let n = $scope.selected
			n[prop] = undefined
		}
	}

	var load = function () {
		var url = buildReportUrl()
		$scope.report.url = url
		$scope.report.data = null
		var x = $cache
			.remember(url, 10, function () {
				return $http.get(url).then(function (resp) {
					return resp.data.data
				})
			})
			.then(function (resp) {
				if (url === $scope.report.url) {
					$scope.report.data = resp
					$scope.report.columns = _.keys(_.first(resp))
				}
			})

		return x
	}

	var buildReportUrl = function (download = null) {
		var params = $scope.report.getParamsString()

		var parts = $scope.report.getReportUrlParts()

		if (download) {
			parts.push(download)
		}

		return parts.join("/") + (params ? "?" + params : "")
	}

	var setSelectedFromStateParams = function () {
		_.forEach($scope.controls, (control) => {
			if (control.id === "date") {
				$scope.selected[control.id] = $state.params.date
					? moment($state.params.date, "Y-M-D").toDate()
					: null
			} else {
				$scope.selected[control.id] = $state.params[control.id]
			}
		})
	}

	var getReportUrlParts = function () {
		return []
	}

	var getCellValue = function (column, record) {
		var r = record
		var x = r[column]
		switch (column) {
			case "recipient":
				return x === "" ? "PROSPECT" : titleCaseFilter(x)
			case "contact":
				return x === "" ? "N/A" : titleCaseFilter(x)
			case "email":
			case "recipient_email":
			case "contact_email":
			case "date":
				return x
			case "recipient_is_lead":
				return x ? "Yes" : "No"
			case "phone":
			case "recipient_phone":
			case "contact_phone":
				return x ? new Telephone(x).toPretty() : x
			default:
				return titleCaseFilter(x)
		}
	}

	var getNameForColumn = function (column) {
		return _.get(_.find($scope.controls, { id: column }), "name", column)
	}

	var fixColumnName = function (column) {
		return this.getNameForColumn(column)
	}

	init()
}

export const CompanyReport = {
	key,
	inject,
	fn,
}
