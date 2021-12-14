/* global angular:false */
angular.module("lt.app").controller("MessageController", ["$scope", "$http", "$company", "$state", "$stateParams", "$location", "$notification", "$messages", "$title", function ($scope, $http, $company, $state, $stateParams, $location, $notification, $messages, $title) {
	"use strict";

	/**
	 * Start it up
	 */
	function init () {
		$scope.loading = {
			contacts: true
		};

		$company.getId().then(function (res) {
			$scope.company_id = res;

			defineScope();
			defineListeners();
		});
	}

	var defineScope = function () {
		// Vars
		$scope.contact = null;
		$scope.contacts = [];
		
		// Funcs
		$scope.selectContact = selectContact;
		$scope.contactSelected = contactSelected;
		$scope.isSelectedContact = isSelectedContact;
		$scope.hasUnreadMessages = $messages.hasUnreadMessages;
		$scope.getTotalUnreadMessages = $messages.getTotalUnreadMessages;

		$messages.getContacts().then(function (contacts) {
			$scope.loading.contacts = false;
			$scope.contacts = contacts;
			if ($stateParams.contactId) {
				var contact = _.find($scope.contacts, function (o) {
					return o.id == $stateParams.contactId;
				});
				if (!_.isEmpty(contact)) {
					selectContact(contact);
					$scope.contact = contact;
					$scope.showContactList = false;
					$title.setTitle(contact.first_name+" "+contact.last_name);
				} else {
					$state.go(".", {contactId: null});
				}
			} 
		});
	};

	var defineListeners = function () {
		$scope.$on("App\\Events\\SmsReceived", function (event, data) {
			if ($scope.contact && $scope.contact.id === data.message.contact_id) {
				$messages.markMessagesAsRead($scope.contact);
			}
		});
	};

	var isSelectedContact = function (c) {
		return _.isEqual(c, $scope.contact);
	};

	var contactSelected = function () {
		return _.isEmpty($scope.contact);
	};

	var selectContact = function (contact) {
		$state.go(".", {contactId:contact.id});
	};

	init();
}]);
