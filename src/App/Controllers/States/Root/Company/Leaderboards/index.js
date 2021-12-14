import _ from "lodash"
import Controller from "../../../Controller"

class LeaderboardsController extends Controller {
	static $inject = ["$scope", "$q", "SmsBatchService", "campaigns"]
	constructor($scope, $q, SmsBatchService, campaigns) {
		super()
	}

	defineListeners() {}

	defineScope() {
		this.$scope.service = this.SmsBatchService
		this.$scope.params = { leaderboard: true }
		this.$scope.related = ["campaign"]
		this.$scope.controls = {
			campaign_id: {
				label: "Campaign",
				value: null,
				type: "select",
				options: _.map(this.campaigns, function (c) {
					return { value: c.id, label: c.name }
				}),
			},
		}

		// Functions
		this.$scope.onChange = this.onChange
	}

	onChange = (x) => {
		this.$scope.params = _.merge(this.$scope.params, x)
	}

	init() {}
}

const key = "LeaderboardsController"
const fn = LeaderboardsController

export const CompanyLeaderboards = {
	key,
	fn,
}
