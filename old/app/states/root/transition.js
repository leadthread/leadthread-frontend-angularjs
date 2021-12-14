
angular.module("lt.app").run(["$transitions", "$state", "$location", function ($transitions, $state, $location) {
	"use strict";
	$transitions.onBefore({ to: "root.**" }, function (trans) {
		var name = trans.to().name;
		var host = $location.host();
		var url = $location.absUrl();

		var cond1 = host !== "app.yaptive.local";
		var cond2 = host !== "app.yaptive.com";
		var cond3 = host !== "stage.yaptive.com";
		var cond4 = !_.includes(name, "root.link");
		var cond5 = !_.includes(name, "root.auth.register");

		if (cond1 && cond2 && cond3 && cond4 && cond5) {
			window.location.href = _.replace(url, host, "app.yaptive.com");
			return false;
		}
	});

	$transitions.onBefore({ to: "root" }, function () {
		return $state.target("root.auth");
	});

}]);
