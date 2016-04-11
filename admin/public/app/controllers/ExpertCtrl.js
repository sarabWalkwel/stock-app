angular.module('ExpertCtrl',[],function($locationProvider){
	$locationProvider.html5Mode(true);
}).controller('ExpertController',['$scope','$http', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder' , function($scope, $http, $location , $window , DTOptionsBuilder , DTColumnDefBuilder ){
	
	//sidebar active li
	var pId = $location.path(); 
	if(pId=="/experts"){
		$('.nav.menu > li').removeClass('active');
		$('.nav.menu > li:nth-child(3)').addClass('active');
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


    // init experts
	$scope.experts = {};
	
	//get experts
	$http.post('/api/experts').success(function(data){
		$scope.experts = data;
	});

	$scope.expertname = "";
	$scope.expertdescription = "";

	//add assexpert function
	$scope.addExpert = function(){
		var name = $scope.expertname;
		var description = $scope.expertdescription;
		console.log(name + description);
		$http.post('/api/expert/add',{'name':name, 'description':description})
		.then(function(response) {
            console.log(response);
	    });
	   $window.location.href = '/experts';
	};

	//edit expert
	$scope.expertDetail= {};
	$scope.findExpert = function(id){
		$http.post('/api/expert/find/'+id).success(function(data){
			$scope.expertDetail = data;
		});
	};

	//edit experts
	$scope.updateExpert = function(id){
		var name = $scope.expertDetail.name;
		var description = $scope.expertDetail.description;
		$http.post('/api/expert/update/'+id,{'name':name, 'description':description})
		.success(function(response) {
            console.log(response);
	    });
	    $window.location.href = '/experts';
	};

	//delete experts
	$scope.deleteExpert = function(id){
		$http.post('/api/expert/delete/'+id).success(function(response) {
            console.log(response);
	    });
	    $window.location.href = '/experts';
	};
}]);