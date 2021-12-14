(function (angular) {
	"use strict";

	var PlaceholderService = function () {
		this.clear();
	};

	PlaceholderService.prototype.set = function (values) {
		this.values = _.merge(this.values, values);
		return this;
	};

	PlaceholderService.prototype.clear = function () {
		this.values = {};
		return this;
	};

	PlaceholderService.prototype.validate = function (str) {
		var re = new RegExp("\\\[.*?\\\]");
		var result = re.exec(str);
		if (result !== null) {
			console.warn("A value for the \""+result[0]+"\" placeholder was not provided");
			str = str.replace(re, "");
			return str;
		}
		return str;
	};

	PlaceholderService.prototype.parse = function (str, values) {
		// Let's just ignore non-strings
		if (!_.isString(str)) {
			return str;
		}

		values = _.merge(this.values, values);
		
		for (var key in values) {
			var exp = "\\\[" + key.replace(/\-/g, " ") + "\\\]";
			var re = new RegExp(exp, "gi");
			str = str.replace(re, values[key]);
		}

		str = this.validate(str);

		return str;
	};

	angular.module("lt.core").service("$placeholder", [PlaceholderService]);

})(window.angular);