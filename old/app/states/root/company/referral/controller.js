angular.module("lt.app").controller("ReferralController",  ["$scope", "link", "campaign", "referral", "contact", "user", "notes", "$popup", "$device", "$stateParams", "$state", function ($scope, link, campaign, referral, contact, user, notes, $popup, $device, $stateParams, $state) {
	"use strict";

	/**
	 * Start it up
	 */
	function init () {
		defineScope();
		defineListeners();
	}

	/**
	 * defines scope variables for controller
	 */
	function defineScope () {
		$scope.link = link;
		$scope.campaign = campaign;
		$scope.referral = referral;
		$scope.contact = contact;
		$scope.user = user;
		$scope.notes = notes;
		$scope.isMobile = isMobile;
		$scope.seeCustomers = seeCustomers;
	}

	function seeCustomers (customer) {
		var params = $stateParams;
		params.contactId = customer.id;
		$state.go("root.company.contact", _.pick(params, ["companyId", "contactId"]));
	}

	/**
	 * defines listeners to be used in controller
	 */
	function defineListeners () {
	}

	/**
	 * Returns the device type
	 * @return {Boolean} Is mobile?
	 */
	function isMobile () {
		return $device.isMobile();
	}

	init();
}]);