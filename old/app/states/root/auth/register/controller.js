/* global angular:false, _:false */
angular.module("lt.app").controller("AuthRegisterController", ["$scope", "$auth", "$stateParams", "$api", "$http", "$state", "company", "$localStorage", "$device", "$q", "$favicon", function ($scope, $auth, $stateParams, $api, $http, $state, company, $localStorage, $device, $q, $favicon) {
	"use strict";
	
	/**
	 * Starts controller
	 */
	function init () {
		$favicon.changeFavicon(company.brand.favicon_id);

		if ($device.isMobile()) {
			defineScope();
		} else {
			$scope.showSite = false;
			$scope.company  = company;
			$api.show("links", $stateParams.linkId).exec().then(function (resp) {
				$scope.url = resp.data;
			});
		}
	}

	/**
	 * Defines scope level variables
	 */
	function defineScope () {
		$scope.showSite = true;
		$scope.company = company;
		$scope.local = {
			fn: "",
			ln: "",
			pn: "",
			em: "",
			cp: "",
		};

		$scope.validation = {
			fn: "",
			ln: "",
			pn: "",
			em: "",
			cp: "",
		};

		$scope.canSubmit = false;

		$scope.validateFn	= validateFn;
		$scope.validateCp	= validateCp;
		$scope.validateLn	= validateLn;
		$scope.validatePn	= validatePn;
		$scope.validateEm	= validateEm;
		$scope.submit		= submit;
		$scope.validate		= validate;
		$scope.reps = [];
		$scope.displayReps = [];
		$scope.rep = {data: ""};
		getReps().then(function (resp) {
			$scope.displayReps = resp;
			$scope.reps = resp;
		});
		$scope.filterReps = filterReps;
	}

	/**
	 * Calls other validation functions and sets canSubmit accordingly
	 */
	function validate () {
		$scope.canSubmit = validateFn($scope.local.fn) && validateCp($scope.local.cp) && validateLn($scope.local.ln) && validatePn($scope.local.pn) && validateEm($scope.local.em);
	}

	/**
	 * Validates First Name variable
	 * @param  {String} x First Name variable
	 * @return {Boolean}   is x valid
	 */
	function validateFn (x) {
		if (x != "" | x != undefined) {
			$scope.validation.fn = x;
			return true;
		} else {
			$scope.validation.fn = "";
			return false;
		}
	}

	/**
	 * Validates Last Name variable
	 * @param  {String} x Last Name variable
	 * @return {Boolean}	is x valid   
	 */
	function validateLn (x) {
		if (x != "" | x != undefined) {
			$scope.validation.ln = x;
			return true;
		} else {
			$scope.validation.ln = "";
			return false;
		}
	}

	/**
	 * Validates Phone Number variable
	 * @param  {String} x Phone Number variable
	 * @return {Boolean}   is x valid
	 */
	function validatePn (x) {
		if (x.match(/^\+?[1-9]\d{1,14}$/)) {
			$scope.validation.pn = x;
			return true;
		} else {
			$scope.validation.pn = "";
			return false;
		}
	}

	/**
	 * Validate Email variable
	 * @param  {String} x Email variable
	 * @return {Boolean}   is x valid
	 */
	function validateEm (x) {
		if (x !== undefined) {
			$scope.validation.em = x;
		}
		return x !== undefined;
	}

	function filterReps (rep) {
		$scope.displayReps = _.filter($scope.reps, function (x) {
			var temp = x.name.toLowerCase();
			var repTemp = rep.toLowerCase();
			return temp.includes(repTemp);
		});
	}

	function getReps () {
		return $q(function (resolve, reject) {
			$api.index("roles").exec().then(function (resp) {
				resp = resp.data;
				var promises = [];

				_.forEach(resp, function (role) {
					if (role.name == "Admin" || role.name == "User") {
						promises.push($api.show("roles", role.id).index("users", {company_id: 2}).exec().then(function (x) {
							return x.data;
						}));
					}
				});

				$q.all(promises).then(function (reps) {
					var arr = _.unionBy(reps[0], reps[1], "email");
					_.forEach(arr, function (x) {
						x.name = x.first_name+" "+x.last_name;
					});
					resolve(arr);
				}, reject);
			}, reject);
		});
	}

	/**
	 * Validate Company variable
	 * @param  {String} x Company variable
	 * @return {Boolean}   is x valid
	 */
	function validateCp (x) {
		if (x !== undefined) {
			$scope.validation.cp = x;
		}
		return x !== undefined;
	}

	/**
	 * [submit description]
	 * @return {[type]} [description]
	 */
	function submit () {
		if ($scope.canSubmit) {
			$auth.register($scope.validation.fn, $scope.validation.ln, $scope.validation.pn, $scope.validation.em, $scope.validation.cp, $stateParams.linkId, $scope.rep.data.id ? $scope.rep.data.id : undefined).then(function (resp) {
				location.href = resp.short_url || resp.long_url;
			});
		}
	}

	init();
}]);