(function (angular) {
	"use strict";

	//For the $api service
	angular.module("lt.core").constant("AUTH_EVENTS", {
		loginSuccess: "auth-login-success",
		loginFailed: "auth-login-failed",
		logoutSuccess: "auth-logout-success",
		sessionTimeout: "auth-session-timeout",
		notAuthenticated: "auth-not-authenticated",
		notAuthorized: "auth-not-authorized"
	});

})(window.angular);