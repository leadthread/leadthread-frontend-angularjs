/*
* @Author: Tyler Arbon
* @Date:   2017-08-08 15:46:27
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-08-16 23:38:04
*/

'use strict';

namespace lt.app {

	interface ILeaderboardsScope {
		$watch: Function;
		loading: string;
		batches: SmsBatch[];
		controls: ILeaderboardsControls;
		onChange: Function;
		params: _.Dictionary<any>;
		service: SmsBatchService;
		related: string[];
	}

	interface ILeaderboardsControls extends IControls {
		campaign_id: ISelectControl<number>;
	}

	export class LeaderboardsController extends StatesController {
		static $inject: string[] = ["$scope", "$q", "SmsBatchService", "campaigns"];
		constructor(protected $scope: ILeaderboardsScope, protected $q: ng.IQService, protected SmsBatchService: SmsBatchService, protected campaigns: Campaign[]) {
			super();
		}

		defineListeners() {
		}

		defineScope() {
			this.$scope.service = this.SmsBatchService;
			this.$scope.params = {leaderboard: true};
			this.$scope.related = ["campaign"];
			this.$scope.controls = {
				campaign_id: {
					label: "Campaign",
					value: null,
					type: "select",
					options: _.map(this.campaigns, function (c) {
						return {value: c.id, label: c.name};
					}),
				}
			}

			// Functions
			this.$scope.onChange = this.onChange;
		}

		onChange = (x) => {
			this.$scope.params = _.merge(this.$scope.params, x);
		}

		init() {
			
        }
	}

	angular.module("lt.app").controller("LeaderboardsController", LeaderboardsController);
}
