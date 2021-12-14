
angular.module("lt.app").run(["$transitions", "$state", "$auth", function ($transitions, $state, $auth) {
	"use strict";

	$transitions.onBefore({ to: "root.console" }, function () {
		return $auth.isSuperAdmin().then(function (isSuperAdmin) {
			if (!isSuperAdmin) {
				return $state.target("root");
			}
		});
	});
}]);
