/* global require:false */

require("./bootstrap.core.js");

(function start() {
	"use strict";
	
	function initApp() {
		setupAngularModule();
	}

	function setupAngularModule() {
		angular.module("lt.link", [
			"templates",
			"lt.core",
		]);
	}

	initApp();
})();