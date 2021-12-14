// angular.module("lt.core").factory("TransformIntercepter", [function () {
// 	"use strict";
	
// 	return {
// 		response: function (response) {
// 			var data = _.get(response, "data.data");
			
// 			if (data) {
// 				response = data;
// 			}

// 			return response;
// 		},
// 	};
// }]);

// angular.module("lt.core").config(["$httpProvider", function ($httpProvider) {
// 	"use strict";
// 	$httpProvider.interceptors.push("TransformIntercepter");
// }]);