 /* global require:false */

 window["$"] = require("jquery");
 window["PNF"] = require("google-libphonenumber").PhoneNumberFormat;
 window["phoneUtil"] = require("google-libphonenumber").PhoneNumberUtil.getInstance();
 window["Raven"] = require("raven-js");
 window["moment"] = require("moment");
 window["md5"] = require("blueimp-md5");
 
 require("angular");
 require("lodash");
 require("angular-ui-bootstrap");
 require("angular-file-upload");
 require("@uirouter/angularjs");
 require("pusher-angular");
 require("ngclipboard");
 require("angular-video-embed");
 require("angular-sanitize");
 
 // require("angular-animate");
 require("angular-ui-bootstrap-datetimepicker");
 // require("angular-qrcode");
 
 
 (function () {
	 "use strict";
	 
	 function initApp () {
		 console.log("Booting up!")
		 setupRaven();
		 setupConsoleTable();
		 setupAlertStringify();
		 setupLodashMixins();
		 setupAngularModule();
	 }
 
	 function setupRaven () {
		 window["$SENTRY_KEY"] = window["$SENTRY_KEY"] || "https://f7dd42c4f02342fca4645e6666b55dd9@sentry.io/120107";
		 if (window["$SENTRY_KEY"]) {
			 window["Raven"].config(window["$SENTRY_KEY"], {
				 release: window["$VERSION"]
			 }).addPlugin(require("raven-js/plugins/angular")).install();
		 }
	 }
 
	 /*----------  HELPER FUNCTION  ----------*/
	 function setupConsoleTable () {
		 if (console.table === undefined) {
			 console.table = console.log;
		 }
	 }
 
	 function setupAlertStringify () {
		 var origAlert = window.alert;
		 window.alert = function (value) {
			 if (_.isObject(value) || _.isArray(value)) {
				 value = JSON.stringify(value);
			 }
			 origAlert(value);
		 };
	 }
 
	 function setupLodashMixins () {
		 _.mixin({
			 "inherit": function (child, base, props) {
				 child.prototype = _.create(base.prototype, _.assign({
					 "_super": base.prototype,
					 "constructor": child
				 }, props));
				 return child;
			 }
		 });
	 }
 
	 function setupAngularModule () {
		 angular.module("templates", []);
		 angular.module("lt.core", [
			 "pusher-angular",
			 "ui.bootstrap",
			 "ui.router",
			 "ngRaven",
			 "angularFileUpload",
			 "ngclipboard",
			 "zen.video-embed",
			 "ngSanitize",
 
			 // "ngCookies",
			 // "ngAnimate",
			 "ui.bootstrap.datetimepicker",
			 // "templates",
			 // "colorpicker.module",
			 // "monospaced.qrcode",
			 
		 ]);
	 }
 
	 initApp();
 })();