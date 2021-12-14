/* global angular:false, _:false, $:false */
angular.module("lt.core").factory("$favicon", ["$api", function ($api) {
	"use strict";

	var map = {
		"link[rel='apple-touch-icon'][sizes='180x180']": "180/180",
		"link[rel='icon'][sizes='32x32']": "32/32",
		"link[rel='icon'][sizes='16x16']": "16/16",
		"link[rel='manifest']": "",
		"link[rel='mask-icon']": "180/180",
	};

	/**
	 * Changes a page's favicon
	 * @param  {integer} faviconId file id for favicon image
	 */
	var changeFavicon = function (faviconId) {
		if (faviconId) {
			$api.show("files", faviconId).exec().then(function (resp) {
				var src = resp.data.fingerprint;

				_.forEach(map, function (value, key) {
					if (value != "") {
						$("head > "+key).first().attr("href", "/files/"+src+"/thumb/"+value);
					}
				});
			});
		}
	};

	var resetFavicon = function () {
		_.forEach(map, function (value, key) {
			$("head > "+key).first().attr("href", "img/logo_50x50_2.png");
		});
	};

	return {
		changeFavicon:changeFavicon,
		resetFavicon: resetFavicon,
	};
}]);