angular.module("lt.core").factory("Prompt", [function () {
	"use strict";
	var Prompt = function (prompt, file_id, image, order) {
		this.prompt = prompt;
		this.file_id = file_id;
		this.image = image;
		this.order = order;
	};

	Prompt.prototype.valueOf = function () {
		return {
			prompt: this.prompt,
			file_id: this.file_id,
			order: this.order
		};
	};

	return Prompt;
}]);

