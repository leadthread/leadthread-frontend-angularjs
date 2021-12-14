(function (angular) {
    "use strict";

    //For the $api service
    angular.module("lt.core").constant("API", {
        host:(function () {
            return location.host ? location.host : "yaptive.local";
        })(),
        port:80,
        secure: false,
        version: "v1"
    });

})(window.angular);