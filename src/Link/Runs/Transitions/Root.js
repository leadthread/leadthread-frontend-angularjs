import _ from "lodash"

export const inject = ["$transitions", "$state", "$location"]

export const fn = ($transitions, $state, $location) => {
	$transitions.onBefore({ to: "root" }, function (trans) {
		var to = _.cloneDeep(trans.params())
		var x = trans.injector().getAsync("target")

		// if (!_.isInteger(to.page)) {
		// 	to.page = 0;
		// 	return $state.target("root", to);
		// }

		// return x.then(function (target) {
		// 	var pages = target.site.pages;
		// 	if (to.page < 0 || to.page >= pages.length) {
		// 		to.page = 0;
		// 		return $state.target("root", to);
		// 	}
		// });
	})
}

// angular.module("lt.core").run(["$transitions", "$state", function ($transitions, $state) {
//

// }]);
