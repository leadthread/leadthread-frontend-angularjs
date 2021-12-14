(function (angular) {
	"use strict";

	angular.module("lt.core").config(["$compileProvider", function ($compileProvider) {   
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|tel|mailto):/);
	}]);
	
})(window.angular);