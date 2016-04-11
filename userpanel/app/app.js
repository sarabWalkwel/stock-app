// STOCK MARKETING
angular.module('stock', ['ngRoute','ui.bootstrap','UserCtrl','LoginSrvc'])
.config(['$locationProvider',function($locationProvider){
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	}).hashPrefix('*');
}])
.controller("MainController",['$scope', '$http' ,'$timeout' , '$uibModal' , '$log',function($scope , $http ,$timeout , $uibModal , $log){

	//init variables
	$scope.predictionList = [];
	$scope.expertList = [];
	$scope.companyPredictions = [];
	$scope.expertProfile = [];

	//url for restApi
	$scope.restApiUrl = "http://localhost:8080/webservices";

	//api calls
	$http.get($scope.restApiUrl+'/prediction/list').success(function(data){
		$scope.predictionList = data;
	});
	$http.get($scope.restApiUrl+'/expert/list').success(function(data){
		$scope.expertList = data;
	});

	
	$scope.viewAllPredictions = function(id){
		$('body').prepend('<div id="overlay-shade" onclick="funcClose(this);"></div>');
		$('body').addClass('overflowAdd');
		$('#content-slide').toggle('slide', { direction: 'right' }, 700);
		$http.get($scope.restApiUrl+'/company/predictionList/'+id).success(function(data){
			$scope.companyPredictions = data;
		});
	}
	$scope.hideAllPredictions = function(){
		$('#overlay-shade').fadeOut();
		$('body').removeClass('overflowAdd');
		$('#content-slide').toggle('slide', { direction: 'right' }, 700);
	}

	$scope.profileView = function(id){
		angular.forEach($scope.expertList,function(value, key){
			if(value.id == id ){
				$scope.expertProfile = value;
			}
		});
		$('body').addClass('overflowAdd');
		$('body').prepend('<div id="overlay-shade" onclick="funcClose(this);"></div>');
		$('#profile-slide').toggle('slide', { direction: 'right' }, 700);
	}
	$scope.profileClose = function(){
		$('#overlay-shade').fadeOut();
		$('body').removeClass('overflowAdd');
		$('#profile-slide').toggle('slide', { direction: 'right' }, 700);
	}


	/*=============================
		pagination
	===============================*/
	$scope.filteredPredictionList = [];
	$scope.currentPage = 1;
	$scope.numPerPage = 10;
	$scope.maxSize = 5;

  	$timeout(function(){
	  $scope.$watch('currentPage + numPerPage', function() {
	    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
	    , end = begin + $scope.numPerPage;
	    
	    $scope.filteredPredictionList = $scope.predictionList.slice(begin, end);
	  });
	},100);

  	/*=======================
  		modal box 
  	=========================*/

	$scope.animationsEnabled = true;

	$scope.loginModal = function () {

		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/login.html',
			controller: 'UserController'
		});

	};

	$scope.signUpModal = function(){ 
		var modalInstance2 = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/signup.html',
			controller: 'UserController'
		});
	};

}]);
