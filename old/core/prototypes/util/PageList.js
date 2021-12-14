angular.module("lt.core").factory("PageList", ["Page", "OrderedList", "PageFactory", function (Page, OrderedList, PageFactory) {
	"use strict";
	
	var PageList = function () {
		// Call super
		var arr = [];
		arr.__proto__ = PageList.prototype;
		arr.push.apply(arr, arguments);
		return arr;
	};
	PageList.prototype = new OrderedList;

	/**
	 * Used to manipulate an item before it is added to the array
	 * @param  {Object}
	 * @return {mixed}
	 */
	PageList.prototype.transform = function (x) {
		if (x) {
			return new PageFactory(x);
		}
		return x;
	};

	/**
	 * Checks that the variable is of a certain type
	 * @param  {mixed}
	 * @return {Boolean}
	 */
	PageList.prototype.isOfType = function (variable) {
		return variable instanceof Page;
	};

	return PageList;
}]);
