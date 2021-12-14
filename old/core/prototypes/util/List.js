(function (angular, _) {
	"use strict";

	angular.module("lt.core").factory("List", [function () {
		var List = function () {
			// Call super
			var arr = [];
			arr.push.apply(arr, arguments);
			arr.__proto__ = List.prototype;
			return arr;
		};
		List.prototype = new Array;

		/**
		 * Pushes new items on to the List
		 * @return {integer} The length of the Array
		 */
		List.prototype.push = function () {
			for (var i = 0; i < arguments.length; i++) {
				if (!this.isOfType(arguments[i])) {
					arguments[i] = this.transform(arguments[i]);
				}
				if (!this.isOfType(arguments[i])) {
					throw "argument #" + (i+1) + " is invalid";
				}
			}
			return Array.prototype.push.apply(this, arguments);
		};

		/**
		 * Clears the List
		 * @return {List}
		 */
		List.prototype.clear = function () {
			this.splice(0, this.length);
			return this;
		};

		/**
		 * Checks that the variable is of a certain type
		 * @param  {mixed}
		 * @return {Boolean}
		 */
		List.prototype.isOfType = function (x) {
			return true;
		};

		/**
		 * Used to manipulate an item before it is added to the array
		 * @param  {Object}
		 * @return {mixed}
		 */
		List.prototype.transform = function (x) {
			return x;
		};

		return List;
	}]);
})(window.angular, window._);
