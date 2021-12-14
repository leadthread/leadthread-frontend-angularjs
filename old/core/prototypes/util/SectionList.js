(function (angular, _) {
	"use strict";

	angular.module("lt.core").factory("SectionList", ["Section", "OrderedList", "SectionFactory", function (Section, OrderedList, SectionFactory) {
		var SectionList = function () {
			// Call super
			var arr = [];
			arr.__proto__ = SectionList.prototype;
			arr.push.apply(arr, arguments);
			return arr;
		};
		
		SectionList.prototype = new OrderedList;

		/**
		 * Used to manipulate an item before it is added to the array
		 * @param  {Object}
		 * @return {mixed}
		 */
		SectionList.prototype.transform = function (x) {
			if (x) {
				return new SectionFactory(x);
			}
			return x;
		};

		/**
		 * Checks that the variable is of a certain type
		 * @param  {mixed}
		 * @return {Boolean}
		 */
		SectionList.prototype.isOfType = function (variable) {
			return variable instanceof Section;
		};

		return SectionList;
	}]);
})(window.angular, window._);
