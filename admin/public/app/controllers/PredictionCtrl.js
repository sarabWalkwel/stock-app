angular.module('PredictionCtrl',[],function($locationProvider){
	$locationProvider.html5Mode(true);
}).controller('PredictionController',['$scope','$http', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder','$filter' , function($scope, $http, $location , $window , DTOptionsBuilder , DTColumnDefBuilder , $filter){
	
	//sidebar active li
	var pId = $location.path(); 
	if(pId=="/prediction"){
		$('.nav.menu > li').removeClass('active');
		$('.nav.menu > li:nth-child(5)').addClass('active');
	}


	//init datatables
	var vm = $scope;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2).withBootstrap().withBootstrapOptions({
            TableTools: {
                classes: {
                    container: 'btn-group',
                    buttons: {
                        normal: 'btn btn-danger'
                    }
                }
            },
            ColVis: {
                classes: {
                    masterButton: 'btn btn-primary'
                }
            },
            pagination: {
                classes: {
                    ul: 'pagination pagination-sm'
                }
            }
        });
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];


    /*===================================================================
		data need to add preditions from companies and shares and experts
    =====================================================================*/
    
    /*==========companies data ===============*/

    // init companies
	$scope.companies = {};
	//get allCompanies
	$http.post('/api/companies').success(function(data){
		$scope.companies = data;
	});

	/*==========experts data ===============*/

	// init experts
	$scope.experts = {};
	//get experts
	$http.post('/api/experts').success(function(data){
		$scope.experts = data;
	});

	/*=========shares data============*/
	$scope.shares = {};
	$scope.getShare = function(id){
		$http.post('/api/shares/distinct/'+id).success(function(data){
			$scope.shares = data;
		});
	}

	/*==============================================
		get all prediction made in predictList
	===============================================*/
    // init predictions object 
    // will be used after getting result from database
	$scope.predictionList = {};
	$http.post('/api/prediction/list').success(function(data){
		$scope.predictionList = data;
	});

	/*=============================
		add prediction data 
	===============================*/
	
	//var init to store data for add predictions
	$scope.addPrediction={};
	//add prediction
	$scope.addToPrediction = function (){
		$scope.addPrediction.datetime = $filter('date')($scope.addPrediction.date, 'MM/dd/yyyy') +" "+ $filter('date')($scope.addPrediction.time, "hh:mm a");
		$http.post('/api/prediction/add',{predict:$scope.addPrediction}).success(function(data){
			$window.location.href = '/prediction';
		});
	};

	$scope.deletePrediction = function(id){
		$http.post('/api/prediction/delete/'+id).success(function(data){
			$window.location.href = '/prediction';
		});
	}

	//edit prediction
	$scope.editPredictionDetails = {};
	$scope.findPrediction = function(id){
		$http.post('/api/prediction/find/'+id).success(function(data){
			$scope.editPredictionDetails = data;
			$scope.editPredictionDetails.date = new Date(data.date);
			$scope.editPredictionDetails.time = new Date(data.date);
		});
	}
	
	$scope.editPrediction = function(){
		$scope.editPredictionDetails.datetime = $filter('date')($scope.editPredictionDetails.date, 'MM/dd/yyyy') +" "+ $filter('date')($scope.editPredictionDetails.time, "hh:mm a");
		$http.post('/api/prediction/edit',{predict:$scope.editPredictionDetails}).success(function(data){
			$window.location.href = '/prediction';
		});
	}


}]);