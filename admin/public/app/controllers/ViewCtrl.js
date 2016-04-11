angular.module('viewCtrl',[],function($locationProvider){
	$locationProvider.html5Mode(true);
}).controller('ViewController',['$scope','$http', '$location', '$window', '$filter' , function($scope, $http, $location , $window , $filter){

	/*==============================================
		get all prediction made in predictList
	===============================================*/
    // init predictions object 
    // will be used after getting result from database
	$scope.predictionList = {};
	$http.post('/api/prediction/list').success(function(data){
		$scope.predictionList = data;
	});
}
