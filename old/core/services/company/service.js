/* global angular:false, _:false */
angular.module("lt.core").factory("$company", ["$stateParams", "$rootScope", "$api", "$auth", "$q", "CompanyService", function ($stateParams, $rootScope, $api, $auth, $q, CompanyService) {
	"use strict";

	var loaded = {
		company: null,
		companies: {},
	};

	var getCompany = function (id) {
		id = id || $stateParams.companyId;
		if (_.isObject(loaded.company)) {
			if ((id && loaded.company.id === id) || !id) {
				return $q.when(loaded.company);
			} else {
				return $q.reject("Could not determine which company to use");
			}
		} else {
			return fetchCompany(id);
		}
	};

	var getCompanies = function () {
		return fetchCompanies();
	};

	var getCompaniesSynchronously = function () {
		return loaded.companies[$auth.getUserId()];
	};

	var getColor = function () {
		return getCompany().then(function (c) {
			return c.brand.color || "#666";
		});
	};

	var getName = function () {
		return getCompany().then(function (c) {
			return c.name;
		});
	};

	var getLogo = function () {
		return fetchLogo();
	};

	var getFavicon = function () {
		return fetchFavicon();
	};

	var getLogoId = function () {
		return getCompany().then(function (c) {
			return c.logo_id;
		});
	};

	var getLogoBackgroundColor = function () {
		return getCompany().then(function (c) {
			return c.logo_background_color;
		});
	};

	var getUrl = function () {
		return getCompany().then(function (c) {
			return c.url;
		});
	};

	var getId = function () {
		return getCompany().then(function (c) {
			return c.id;
		});
	};

	var getIndustry = function () {
		return getCompany().then(function (c) {
			return c.industry;
		});
	};

	var setCompany = function (c) {
		// throw "Not implemented";
		loaded.company = c;
		// loadLogo();
		// return c;
	};

	/**
	 * Fetches a company logo for the current company
	 * @return {Promise} A Promise containing the logo
	 */
	function fetchLogo () {
		return getCompany().then(function (company) {
			if (company.brand.logo) {
				return company.brand.logo;
			} else {
				return $q.reject("no logo attached to company");
			}
		});
	}

	/**
	 * Fetches a company favicon for the current company
	 * @return {Promise} A Promise containing the favicon
	 */
	function fetchFavicon () {
		return getCompany().then(function (company) {
			if (company.brand.favicon) {
				return company.brand.favicon;
			} else {
				return $q.reject("no favicon attached to company");
			}
		});
	}

	/**
	 * Fetches a company with a provided id from the database
	 * @return {Promise} Promise containing the company
	 */
	function fetchCompany (company_id) {
		return $q(function (resolve, reject) {
			var company = null;
			getCompanies().then(function (companies) {
				if (companies.length > 0 && company_id) {
					company = _.find(companies, {"id": company_id});
				}

				if (company) {
					loaded.company = company;
					resolve(company);
				} else {
					reject("Could not find a company");
				}
			}, reject);
		});
	}

	/**
	 * Fetches all companies associated with the current user from the database
	 * @return {Promise} Promise containing the companies
	 */
	function fetchCompanies () {
		var user_id = $auth.getUserId();

		if (!user_id) {
			return $q.reject("Not a valid user id");
		} else {
			return CompanyService.index().then(function (companies) {
				companies = _.map(companies, function (c) {
					return c.load(true);
				});
				return $q.all(companies).then(function (companies) {
					loaded.companies[user_id] = companies;
					return loaded.companies[user_id];
				});
			});
		}
	}

	// $rootScope.$watch(function () {
	// 	return JSON.stringify([$auth.getUserId(), $stateParams.companyId]);
	// }, function (n, o) {
	// 	if (n !== o || company.id === null) {
	// 		var uid = $auth.getUserId();
	// 		var cid = $stateParams.companyId;

	// 		if (uid) {
	// 			$api.show("users", uid).index("companies").exec().then(function (c) {
	// 				c = c.data;
	// 				companies = [];

	// 				_.forEach(c, function (com) {
	// 					companies.push(com);
	// 				});

	// 				if (companies.length > 0 && cid) {
	// 					company = _.find(companies, ["id", cid]);
	// 				}
	// 			});
	// 		} else {
	// 			// When they log out
	// 			company = getDefaultCompany();
	// 			companies = [];
	// 		}
	// 	}
	// });

	return {
		getColor:getColor,
		getCompanies:getCompanies,
		getCompaniesSynchronously:getCompaniesSynchronously,
		getCompany:getCompany,
		getFavicon:getFavicon,
		getId:getId,
		getIndustry: getIndustry,
		getLogo:getLogo,
		getLogoBackgroundColor:getLogoBackgroundColor,
		getLogoId:getLogoId,
		getName:getName,
		getUrl:getUrl,
		setCompany:setCompany
	};
}]);