(function (angular) {
	"use strict";

	var ModalSms = function () {
		this.open = false;
		this.type = "name";
	};

	ModalSms.prototype.getNamePromise = function () {
		this.open = true;
		this.type = "name";
	};

	angular.module("lt.core").service("$modalSms", [ModalSms]);

})(window.angular);