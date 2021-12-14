/* global require:false */

require("./bootstrap.core.js");

require("chart.js");
require("angular-utils-pagination");
require("angular-cookies");
require("add-to-homescreen");
require("ui-select");
require("angular-bootstrap-colorpicker");

(function () {
	"use strict";
	
	function initApp() {
		setupAngularModule();
	}

	function setupAngularModule() {
		angular.module("lt.app", [
			"templates",
			"lt.core",
			"angularUtils.directives.dirPagination",
			"ngCookies",
			"ui.select",
			"colorpicker.module",
		]);
	}

	initApp();
})();
