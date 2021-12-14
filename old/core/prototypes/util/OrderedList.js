(function (angular, _) {
	"use strict";

	angular.module("lt.core").factory("OrderedList", ["List", function (List) {
		var OrderedList = function () {
			// Call super
			var arr = [];
			arr.__proto__ = OrderedList.prototype;
			arr.push.apply(arr, arguments);
			return arr;
		};

		OrderedList.prototype = new List;

		/**
		 * Reorders and rekeys the list by the order properties on each list item
		 * @param  {Boolean} desc Sort direction. ASC by default
		 * @return {void}
		 */
		OrderedList.prototype.reorder = function (desc) {
			var direction = 1;
			if (desc) {
				direction = -1;
			}

			function compare (a, b) {
				if (a.order < b.order)
					return -1 * direction;
				if (a.order > b.order)
					return 1 * direction;
				return 0;
			}

			this.sort(compare);

			// Fix the order values
			for (var i = 0; i < this.length; i++) {
				this[i].order = direction === 1 ? i : this.length - i;
			}
		};

		/**
		 * Pushes new items on to the List
		 * @return {integer} The length of the Array
		 */
		OrderedList.prototype.push = function () {
			var length = List.prototype.push.apply(this, arguments);
			this.reorder();
			return length;
		};

		/**
		 * Checks that the variable is of a certain type
		 * @param  {mixed}
		 * @return {Boolean}
		 */
		OrderedList.prototype.isOfType = function (x) {
			return x instanceof Object;
		};

		return OrderedList;
	}]);
})(window.angular, window._);
