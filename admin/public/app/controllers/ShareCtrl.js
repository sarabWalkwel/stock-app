angular.module('ShareCtrl',['datatables','datatables.bootstrap'],function($locationProvider){
	$locationProvider.html5Mode(true);
}).controller('ShareController',['$scope','$http', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder','$routeParams' ,'$route' , function($scope, $http, $location , $window , DTOptionsBuilder , DTColumnDefBuilder , $routeParams , $route){
	
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

	
	//sidebar active li
	$scope.companyid = $routeParams.companyid;
	var pId = $location.path(); 
	if(pId=="/sharePrice/"+$scope.companyid){
		$('.nav.menu > li').removeClass('active');
		$('.nav.menu > li:nth-child(2)').addClass('active');
	}

	// init companies
	$scope.companySharesDetails = {};
	
	//get allCompanies
	$http.post('/api/company/sharepricelist/'+$scope.companyid).success(function(data){
		$scope.companySharesDetails = data;
	});

	$scope.addshareprice =" ";
	//adding shares
	$scope.addShareRate = function(){
		var id = $scope.companyid;
		var shareprice = $scope.addshareprice;
		$http.post('/api/company/addShare/'+id,{'shareprice':shareprice}).success(function(data){
			$window.location.href = "/sharePrice/"+ $scope.companyid;
		});
	};

	$scope.editCompanyName = " ";
	$scope.editCompanyShare = " ";
	$scope.editShareId = " ";
	//update ng-model content for editing
	$scope.editShareDetail = function(shareid, name , share ){
		$scope.editCompanyName = name;
		$scope.editCompanyShare = share;
		$scope.editShareId = shareid;
	};

	//edit share price
	$scope.editCompany = function(id , share){
		console.log(share);
		$http.post("/api/share/edit/"+id,{'share':share}).success(function(data){
			$window.location.href = "/sharePrice/"+ $scope.companyid;
		});
		
	};

	//delete share price
	$scope.deleteSharePrice = function(id){
		$http.post('/api/share/delete/'+id).success(function(res){
			$window.location.href = "/sharePrice/"+ $scope.companyid;
		});
	};
}]);