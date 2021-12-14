namespace lt {

    interface IFormLayoutScope {
        form: any;
		options: IPopupField[];
		focus: string;
		setFocus: Function;
    }

	angular.module("lt.core").directive("formLayout", ["$popup", ($popup: IPopupService) => { 
		"use strict";

		return {
			restrict: "E",
			templateUrl: "components/form-layout/index.html",
			scope : {
				form:"=",
				options: "=",
			},
			link: function ($scope: IFormLayoutScope) {
				
				function init () { 
					$scope.focus = null;
					$scope.setFocus = setFocus;
				}

				function setFocus (key: string) {
					$scope.focus = key;
				}

				init();
			}
		};
	}]);
}
