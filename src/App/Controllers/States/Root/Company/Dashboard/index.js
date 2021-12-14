import moment from "moment"
import _ from "lodash"
import addToHomescreen from "add-to-homescreen"
import { ChartClass as Chart } from "../../../../../../Core/Classes"
import Controller from "../../../Controller"

class DashboardController extends Controller {
	timeFormat = "YYYY-MM-DD"
	campaign

	static $inject = [
		"$scope",
		"campaigns",
		"$stateParams",
		"$http",
		"$location",
		"$cache",
		"$device",
		"$state",
	]
	constructor(
		$scope,
		campaigns,
		$stateParams,
		$http,
		$location,
		$cache,
		$device,
		$state
	) {
		super()
		this.campaign = $stateParams.campaignId
			? _.find(this.campaigns, { id: $stateParams.campaignId })
			: null
	}

	defineListeners() {
		this.$scope.$watch("campaign.id", (n) =>
			this.$location.search("campaignId", n)
		)
	}

	defineScope() {
		this.$scope.gotoReportForMetric = this.gotoReportForMetric
		this.$scope.campaign = this.campaign
		this.$scope.campaigns = this.campaigns
		this.$scope.showChart = true
		this.$scope.reviewScores = _.groupBy(
			this.$scope.company.latest_review_scores,
			"name"
		)
		console.log(this.$scope.reviewScores)
		this.$scope.metrics = [
			{
				key: "contact_sent",
				mobile_order: 0,
				order: 0,
				icon: "icon-send",
				color: "#3498D8",
				name: "Sent",
				value: null,
				report: {
					state: "^.report.user",
					params: { contact_sent: "yes" },
				},
			}, //"#60accc" //"#60accc"
			{
				key: "contact_opened",
				mobile_order: 2,
				order: 1,
				icon: "icon-envelope-open-o",
				color: "#1ABC9C",
				name: "Opened",
				value: null,
				report: {
					state: "^.report.contact",
					params: { contact_opened: "yes" },
				},
			}, //"#ED993E" //"#60accc"
			{
				key: "contact_shares",
				mobile_order: 4,
				order: 2,
				icon: "icon-share-alt",
				color: "#2ECC71",
				name: "Shared",
				value: null,
				report: {
					state: "^.report.contact",
					params: { contact_shares: "yes" },
				},
			}, //"#F75D5D" //"#60accc"
			{
				key: "recipient_opens",
				mobile_order: 1,
				order: 3,
				icon: "icon-eye",
				color: "#EAE022",
				name: "Views",
				value: null,
				report: {
					state: "^.report.recipient",
					params: { recipient_opens: "yes" },
				},
			}, //"#ac5dd5" //"#538fa9"
			{
				key: "recipient_clicked_total",
				mobile_order: 3,
				order: 4,
				icon: "icon-hand-o-up",
				color: "#E67E22",
				name: "Action Clicks",
				value: null,
				report: { state: "^.report.recipient", params: {} },
			}, //"#6F828F" //"#538fa9"
			{
				key: "recipient_watched_video",
				mobile_order: 5,
				order: 5,
				icon: "icon-play-circle-o",
				color: "#E74C3C",
				name: "Video Views",
				value: null,
				report: {
					state: "^.report.recipient",
					params: { recipient_watched_video: "yes" },
				},
			}, //"#56C76C" //"#538fa9"
			// {key: "recipient_is_lead_total", mobile_order: 6, order: 6, icon: "icon-users", color: "#34495E", name: "Referrals", value: null, report: {state:"^.report.recipient", params: {recipient_is_lead: "yes"}}}, //"#557BF7" //"#427084"
		]
	}

	init() {
		let data = this.loadReport(this.campaign).then(this.bindReportToScope)

		if (this.$device.isDesktop()) {
			data.then(this.buildChart).then((show) => {
				this.$scope.showChart = show
			})
		} else {
			this.$scope.showChart = false
			this.addToHomescreen()
		}
	}

	bindReportToScope = (data) => {
		// Sum all the keys ignoring the date
		let metrics = _.reduce(
			data,
			(carry, item) => {
				for (const key in item) {
					if (key !== "date") {
						carry[key] = !_.isUndefined(carry[key])
							? carry[key] + item[key]
							: item[key]
					}
				}
				return carry
			},
			{}
		)

		_.forEach(this.$scope.metrics, (m) => {
			m.value = _.get(metrics, m.key, 0)
		})

		return data
	}

	loadReport(campaign) {
		let params = this.getParams(campaign)
		let url = "/report/event?" + params
		return this.$cache.remember(url, 10, () => {
			return this.$http.get(url).then(function (resp) {
				return resp.data.data
			})
		})
	}

	getParams(campaign) {
		let campaignId = _.get(campaign, "id", null)
		let params = [
			{ key: "date", value: null },
			{ key: "company_id", value: this.$stateParams.companyId },
			{ key: "recipient_watched_video", value: null },
			{ key: "contact_sent", value: null },
			{ key: "contact_opened", value: null },
			{ key: "contact_shares", value: null },
			{ key: "recipient_opens", value: null },
			{ key: "recipient_is_lead_total", value: null },
			{ key: "recipient_clicked_total", value: null },
		]

		if (campaignId) {
			params.push({ key: "campaign_id", value: campaignId })
		}

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

	buildChart = (data) => {
		const timeAxis = this.getTimeAxis(data)

		if (timeAxis.length > 1) {
			let chartOptions = {
				type: "bar",
				data: {
					labels: timeAxis,
					datasets: this.getDataSets(data, timeAxis),
				},
				options: {
					title: "Chart",
					scales: {
						xAxes: [
							{
								type: "time",
								stacked: true,
								time: {
									unit: "hour",
									stepSize: 24,
									// format: this.timeFormat,
									displayFormats: {
										hour: "MMM DD",
									},
									tooltipFormat: "",
								},
								scaleLabel: {
									display: true,
									labelString: "Date",
								},
							},
						],
						yAxes: [
							{
								stacked: true,
								scaleLabel: {
									display: true,
									labelString: "value",
								},
							},
						],
					},
				},
			}

			console.log(chartOptions)

			var myChart = new Chart("chart", chartOptions)
			return true
		} else {
			return false
		}
	}

	getTimeAxis(data) {
		var dates = _(data)
			.map((set) => {
				return moment(set.date)
			})
			.value()

		var max = _.max(dates)
		var min = max.clone().subtract(60, "days")
		var axis = []
		max.add(1, "days")
		while (min <= max) {
			axis.push(min.format("YYYY-MM-DD"))
			min.add(1, "days")
		}

		console.log(axis)
		return axis
	}

	getDataSets(data, timeAxis) {
		return _.map(this.$scope.metrics, (metric) => {
			return this.getDataSet(data, timeAxis, metric)
		})
	}

	getDataSet(data, timeAxis, metric) {
		console.log(data, metric)
		return {
			label: metric.name,
			// fillColor: "rgba(220,220,220,0.5)",
			// strokeColor: "rgba(220,220,220,0.8)",
			// highlightFill: "rgba(220,220,220,0.75)",
			// highlightStroke: "rgba(220,220,220,1)",
			backgroundColor: metric.color,
			borderColor: metric.color,
			fill: true,
			lineTension: 0,
			data: _(timeAxis)
				.map((i) => {
					var k = _.find(data, { date: i })
					return k ? k[metric.key] : 0
				})
				.value(),
		}
	}

	addToHomescreen() {
		if (this.$device.isMobile()) {
			addToHomescreen({
				startDelay: 0,
				lifespan: 0,
				maxDisplayCount: 0,
				// debug: true,
				// autostart: true,
				message: {
					en_us: {
						ios: "To add Yaptive to your Iphone's home screen: tap %icon and then <strong>Add to Home Screen</strong>.",
						android:
							"To add Yaptive to your smart phone's home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon %icon.</small>",
					},
				},
			})
		}
	}

	gotoReportForMetric = (metric) => {
		let state = metric.report.state
		let params = metric.report.params
		let campaignId = _.get(this, "campaign.id", null)
		if (campaignId) {
			params.campaign_id = campaignId
		}
		this.$state.go(state, params)
	}
}

const key = "DashboardController"
const fn = DashboardController

export const CompanyDashboard = {
	key,
	fn,
}
