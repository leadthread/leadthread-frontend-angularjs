(function (angular) {
	"use strict";

	angular.module("lt.core").constant("PUSHER", {
		KEY: window.$PUSHER_KEY || "0863b76078807e94b77c",
	});
})(window.angular);