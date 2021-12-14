'use strict';

namespace lt.app {

	interface ILeaderboardScope {
		$watch: Function;
		$on: Function;
		inSet: Function;
		getPlacement: Function;
		contacts: Contact[];
		sets: number[];
	}

	export class LeaderboardController extends StatesController {
		public channel: string;
		static $inject: string[] = ["$scope", "$socket", "sms_batch", "contacts", "points"];
		constructor(protected $scope: ILeaderboardScope, protected $socket: ISocketService, protected sms_batch: SmsBatch, protected contacts: Contact[], protected points: Point[]) {
			super();
			this.channel = "sms-batch."+sms_batch.id;
		}

		defineListeners() {
			this.subscribe(this.channel);

			this.$scope.$on("App\\Events\\Point\\Created", (event, data: any) => {
				let contact_id: number = data.point.contact_id;
				let contact = _.find<Contact>(this.$scope.contacts, (c) => {
					return c.id === contact_id;
				});
				contact.points.push(data.point);
			});

			this.$scope.$on("$destroy", () => {
				this.unsubscribe(this.channel);
			})
		}

		defineScope() {
			this.$scope.sets = this.calcSets(this.contacts);

			_.forEach(this.contacts, (contact) => {
				contact.points = _.filter<Point>(this.points, (point) => {
					return point.contact_id === contact.id;
				});
			});

			this.$scope.contacts = this.contacts;
			this.$scope.inSet = this.inSet;
			this.$scope.getPlacement = this.getPlacement;
		}

		inSet = (item: number, set: number): boolean => {
			let count = 0;
			let start = count;
			let end = Infinity;
			let sets = this.$scope.sets;
			
			for (let i=0; i <= set; i++) {
				start = count;
				count += sets[i];
				end = count;
			}

			return item >= start && item < end;
		}

		getPlacement(index: number) {
			let x = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
			return index < x.length ? x[index] : null; 
		}

		calcSets(set: any[], maxRows: number = 16, maxColumns: number = 4): number[] {
			let x = [];
			let remaining = set.length;
			let done = false;

			remaining -= 10;
			x.push(10);

			_.forEach(_.range(maxColumns), (columns: number) => {
				let perRow = Math.ceil(remaining/columns);
				if (!done && perRow <= maxRows) {
					_.forEach(_.range(columns), (i) => {
						x.push(perRow);
					});
					done = true;
				}
			});

			if (!done) {
				_.forEach(_.range(maxColumns), (columns: number) => {
					x.push(maxRows);
				});
			}

			console.log(x);

			return x;
		}

		subscribe = (channel) => {
			this.$socket.subscribe(channel);
		}

		unsubscribe = (channel) => {
			this.$socket.unsubscribe(channel);
		}

		init() {
			
        }
	}

	angular.module("lt.app").controller("LeaderboardController", LeaderboardController);
}
