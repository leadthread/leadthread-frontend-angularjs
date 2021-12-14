angular.module("lt.app").run(["$transitions", "$auth", "$state", function ($transitions, $auth, $state) {
	"use strict";

	$transitions.onBefore({ to: "root.company.contacts.index" }, function (trans) {
		var params = _.cloneDeep(trans.params());
		var userId = $auth.getUserId();

		return $auth.hasRole("Admin").then(function (isAdmin) {
			if (!params.userId || (!isAdmin && params.userId !== userId)) {
				params.userId = userId;
				return $state.target("root.company.contacts.index", params);
			}
		});
	});
}]);