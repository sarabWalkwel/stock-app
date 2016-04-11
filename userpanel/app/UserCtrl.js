angular.module('UserCtrl',['LoginSrvc'])
.controller('UserController',['$scope' ,'$uibModalInstance', '$log', '$http', 'LoginService' ,function($scope, $uibModalInstance, $log , $http , LoginService){
	
	$scope.restApiUrl = "http://localhost:8080/webservices";

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.checkPassword = false;
	$scope.register = {};
	$scope.signup = function(){
		if($scope.register.password ==  $scope.register.cpassword){
			LoginService.userSignup($scope.register.name,$scope.register.email,$scope.register.password);
		}
		else{
			$scope.checkPassword = true;
		}
	}

	//login 
	$scope.loginDetails = {}
	$scope.login = function(){
		console.log($scope.loginDetails)
		$http.post($scope.restApiUrl+'/login',{userDetails:$scope.loginDetails}).success(function(data){
			console.log(data);
		});
	}
}]);