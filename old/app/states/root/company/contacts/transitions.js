angular.module("lt.app").run(["$transitions", "$auth", "$state", function ($transitions, $auth, $state) {
	"use strict";

	$transitions.onBefore({ to: "root.company.contacts" }, function (trans) {
		return $state.target("root.company.contacts.index", _.cloneDeep(trans.params()));
	});
}]);