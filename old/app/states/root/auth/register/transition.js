
angular.module("lt.app").run(["$transitions", "$state", "$q", "$auth", "$http", function ($transitions, $state, $q, $auth, $http) {
	"use strict";

	$transitions.onBefore({ to: "root.auth.register" }, function (trans) {
		var x = trans.injector().getAsync('link');
		return x.then(function (link) {
			if (link.contact_id) {
				return $auth.loginWithLink(link).then(function () {
					return $state.target("root.link", {linkId: link.id});
				});
			} else {
				return true;
			}
		});
		
	});
}]);
