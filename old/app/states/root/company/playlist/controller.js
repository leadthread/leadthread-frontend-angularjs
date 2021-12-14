angular.module("lt.app").controller("PlaylistController", ["$scope", "$popup", "$q", "$auth", "$notification", "$stateParams", "$location", "$state", "$http", "$cache", "$transitions", "playlists", "campaigns", "company_id", "PlaylistService", "PlaylistScheduleService", "ContactService", function ($scope, $popup, $q, $auth, $notification, $stateParams, $location, $state, $http, $cache, $transitions, playlists, campaigns, company_id, PlaylistService, PlaylistScheduleService, ContactService) {
	"use strict";

	var init = function () {
		defineScope();
		defineListeners();
	};

	var defineScope = function () {
		$scope.campaigns = campaigns;
		$scope.companyId = company_id;
		$scope.userId = $auth.getUserId();
		
		// Datepickers
		$scope.datepickers = {
			opened: {},
			options: {},
			toggle: function (id) {
				this.opened[id] = !this.opened[id];
			}
		};

		// Panels
		$scope.panels = {
			playlists: {
				active: null,
				perPage: 10,
				items: playlists,
				loading: false,
				search: "",
			},
			schedules: {
				active: null,
				perPage: 10,
				items: [],
				loading: false,
				search: "",
			},
			contacts: {
				active: null,
				perPage: 10,
				items: [],
				loading: false,
				search: "",
			}
		};

		playlistView(_.find($scope.panels.playlists.items, {"id": $stateParams.playlistId}));

		// Functions
		$scope.playlistNew = playlistNew;
		$scope.playlistEdit = playlistEdit;
		$scope.playlistView = playlistView;
		$scope.playlistDelete = playlistDelete;
		$scope.scheduleNew = scheduleNew;
		$scope.scheduleDelete = scheduleDelete;
		$scope.scheduleEdit = scheduleEdit;
		$scope.contactsAdd = contactsAdd;
		$scope.contactDelete = contactDelete;
	};

	var defineListeners = function () {
		$scope.$watch("panels.playlists.active.id", function (n, o) {
			if (n!==o) {
				$location.search('playlistId', n);
			}
		});
	};

	/*=================================
	=            PLAYLISTS            =
	=================================*/
	
	var playlistInsertIntoArray = function (playlist) {
		$scope.panels.playlists.items = _.unionBy($scope.panels.playlists.items, [playlist], "id");
		return playlist;
	};

	var playlistNew = function () {
		return playlistOpenForm()
			.then(playlistSave)
			.then(playlistView);
	};

	var playlistEdit = function (model) {
		return playlistOpenForm(model)
			.then(playlistSave);
	};

	var playlistSave = function (model) {
		model = _.cloneDeep(model);
		model.user_id = $scope.userId;
		return PlaylistService.save(model).then(playlistInsertIntoArray);
	};

	var playlistView = function (model) {
		$scope.panels.playlists.active = model;
		$scope.panels.schedules.items = null;
		if (model) {
			schedulesLoad(model);
			contactsLoad(model);
		}
	};

	var playlistDelete = function (playlist) {
		return $popup.decide("Are you sure you want to delete this?").then(function () {
			return PlaylistService.destroy(playlist.id).then(function () {
				_.remove($scope.panels.playlists.items, {id: playlist.id});
				playlistView(_.first($scope.panels.playlists.items));
			});
				
		});
	};

	var playlistOpenForm = function (model) {
		model = model || {};

		return $q(function (resolve, reject) {
			var form = [
				{type: "input", subtype: "text", label: "Name", key: "name", value: null, required: true},
				{type: "select", subtype: null, label: "Playlist Type", key: "type", value: null, required: true, choices: {
					"Timer initiated": "timer",
					"Date initiated": "date",
				}},
			];

			_.forEach(form, function (field) {
				field.value = model[field.key];
			});

			$popup.form(form, "Playlist", false).then(function (resp) {
				resolve(_.merge(model, resp));
			}, reject);
		});
	};
	
	/*=====  End of PLAYLISTS  ======*/
	
	/*================================
	=            CONTACTS            =
	================================*/
	
	var contactsLoad = function (playlist) {
		contactsLoading();
		return ContactService.indexFor("playlists", playlist.id)
			.then(contactsSet)
			.then(contactsLoaded);
	};

	var contactsLoading = function (contacts) {
		$scope.panels.contacts.loading = true;
		return contacts;
	};

	var contactsLoaded = function (contacts) {
		$scope.panels.contacts.loading = false;
		return contacts;
	};

	var contactsSet = function (contacts) {
		$scope.panels.contacts.items = contacts;
		return contacts;
	};

	var contactsAdd = function () {
		$state.go("^.send", {type:"playlist", playlistId:_.get($scope, "panels.playlists.active.id")});
	};

	var contactDelete = function (playlist, contact) {
		return $popup.decide("Are you sure you want to delete this?").then(function () {
			return $http.post("/api/v1/playlists/" + playlist.id + "/detach", {"contact_ids": [contact.id]}).then(function () {
				if (playlist.id === _.get($scope, "panels.playlists.active.id")) {
					_.remove($scope.panels.contacts.items, {id: contact.id});
				}
				$cache.forgetWhere("playlists-"+playlist.id);
			});
		});
	};

	/*=====  End of CONTACTS  ======*/

	/*=================================
	=            SCHEDULES            =
	=================================*/
	
	var schedulesLoad = function (playlist) {
		schedulesLoading();
		return PlaylistScheduleService.indexFor("playlists", playlist.id)
			.then(schedulesSetCampaigns)
			.then(schedulesSet)
			.then(schedulesLoaded);
	};

	var schedulesLoaded = function (schedules) {
		$scope.panels.schedules.loading = false;
		return schedules;
	};

	var schedulesLoading = function (schedules) {
		$scope.panels.schedules.loading = true;
		return schedules;
	};

	var schedulesSet = function (schedules) {
		$scope.panels.schedules.items = schedules;
		return schedules;
	};

	var schedulesSetCampaigns = function (schedules) {
		return _.map(schedules, scheduleSetCampaign);
	};

	var scheduleSetCampaign = function (schedule) {
		schedule._campaign = _.find($scope.campaigns, {id: schedule.campaign_id});
		return schedule;
	};

	var scheduleInsertIntoArray = function (schedule) {
		$scope.panels.schedules.items = _.unionBy([schedule], $scope.panels.schedules.items, "id");
		return schedule;
	};

	var scheduleNew = function () {
		return scheduleOpenForm()
			.then(scheduleSave)
			.then(scheduleSetCampaign)
			.then(scheduleInsertIntoArray);
	};

	var scheduleEdit = function (schedule) {
		return scheduleOpenForm(schedule)
			.then(scheduleSave)
			.then(scheduleSetCampaign)
			.then(scheduleInsertIntoArray);
	};

	var scheduleOpenForm = function (schedule) {
		schedule = schedule || {};
		return $popup.openPlaylistSchedulesModal({
			schedule: schedule,
			campaigns: $scope.campaigns,
			playlist: $scope.panels.playlists.active,
		}).then(function (resp) {
			return _.merge(schedule, resp);
		});
	};

	var scheduleDelete = function (schedule) {
		return $popup.decide("Are you sure you want to delete this?").then(function () {
			return PlaylistScheduleService.destroyFor("playlists", $scope.panels.playlists.active.id, schedule.id)
				.then(function () {
					_.remove($scope.panels.schedules.items, {id: schedule.id});
				});
		});
	};

	var scheduleSave = function (model) {
		model = _.cloneDeep(model);
		// model.date_send_at = model.date_send_at ? moment(model.date_send_at).format("Y-MM-DD HH:mm:ssZZ") : null;
		// model.timer_time = model.timer_time ? moment(model.timer_time).format("HH:mmZZ") : null;
		delete model._campaign;

		return PlaylistScheduleService.saveFor("playlists", $scope.panels.playlists.active.id, model)
			.then(scheduleInsertIntoArray);
	};
	
	/*=====  End of SCHEDULES  ======*/

	init();
}]);