angular.module('lt.app').controller('AuthCodeController', ["$scope","$state",function($scope,$state){
	function init(){
		defineScope();
	}

	function defineScope(){
		$scope.valid = false;
		$scope.checkCode = checkCode;
	}

	function checkCode(code){
		if (code.length == 6){
			$scope.valid = true;
		}else {
			$scope.valid = false;
		}
	}

	init();
}]);