import _ from "lodash"
import Controller from "../../../Controller"

class LeaderboardController extends Controller {
	channel
	static $inject = ["$scope", "$socket", "sms_batch", "contacts", "points"]
	constructor($scope, $socket, sms_batch, contacts, points) {
		super()
		this.channel = "sms-batch." + sms_batch.id
	}

	defineListeners() {
		this.subscribe(this.channel)

		this.$scope.$on("App\\Events\\Point\\Created", (event, data) => {
			let contact_id = data.point.contact_id
			let contact = _.find(this.$scope.contacts, (c) => {
				return c.id === contact_id
			})
			contact.points.push(data.point)
		})

		this.$scope.$on("$destroy", () => {
			this.unsubscribe(this.channel)
		})
	}

	defineScope() {
		this.$scope.sets = this.calcSets(this.contacts)

		_.forEach(this.contacts, (contact) => {
			contact.points = _.filter(this.points, (point) => {
				return point.contact_id === contact.id
			})
		})

		this.$scope.contacts = this.contacts
		this.$scope.inSet = this.inSet
		this.$scope.getPlacement = this.getPlacement
	}

	inSet = (item, set) => {
		let count = 0
		let start = count
		let end = Infinity
		let sets = this.$scope.sets

		for (let i = 0; i <= set; i++) {
			start = count
			count += sets[i]
			end = count
		}

		return item >= start && item < end
	}

	getPlacement(index) {
		let x = [
			"1st",
			"2nd",
			"3rd",
			"4th",
			"5th",
			"6th",
			"7th",
			"8th",
			"9th",
			"10th",
		]
		return index < x.length ? x[index] : null
	}

	calcSets(set, maxRows = 16, maxColumns = 4) {
		let x = []
		let remaining = set.length
		let done = false

		remaining -= 10
		x.push(10)

		_.forEach(_.range(maxColumns), (columns) => {
			let perRow = Math.ceil(remaining / columns)
			if (!done && perRow <= maxRows) {
				_.forEach(_.range(columns), (i) => {
					x.push(perRow)
				})
				done = true
			}
		})

		if (!done) {
			_.forEach(_.range(maxColumns), (columns) => {
				x.push(maxRows)
			})
		}

		console.log(x)

		return x
	}

	subscribe = (channel) => {
		this.$socket.subscribe(channel)
	}

	unsubscribe = (channel) => {
		this.$socket.unsubscribe(channel)
	}

	init() {}
}

const key = "LeaderboardController"
const fn = LeaderboardController

export const CompanyLeaderBoard = {
	key,
	fn,
}
