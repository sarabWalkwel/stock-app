 
 angular.module('UserCtrl',['datatables','datatables.bootstrap'],function($locationProvider){
	$locationProvider.html5Mode(true);
})
.controller('UserController',['$scope','$http', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'AuthService' ,'$timeout','$routeParams' ,'$route', function($scope, $http, $location , $window , DTOptionsBuilder , DTColumnDefBuilder , AuthService , $timeout ,$routeParams,$route)
{
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
	var pId = $location.path(); 
	if(pId=="/users"){
		$('.nav.menu > li').removeClass('active');
		$('.nav.menu > li:nth-child(6)').addClass('active');
	}
	
  $scope.users = [];
  $http.post('/api/users').success(function(data){
    $scope.users = data;
  });

  $scope.editUser = {};
  $scope.findUser = function(id){
    angular.forEach($scope.users, function(data) {
      if(data._id == id){
        $scope.editUser = data;
      }
    });
  }
  $scope.userToBeEdited = function(){
    $http.post('/api/user/edit',{user:$scope.editUser}).success(function(data){
      $window.location.href = "/users";
    });
  }

  $scope.deleteUser =function(id){
    $http.post('/api/user/delete/'+id).success(function(data){
      $window.location.href = "/users";
    });
  }

  //add user
  $scope.addname ="";
  $scope.addemail ="";
  $scope.addrole ="";
  $scope.addemail ="";
  $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.addname,$scope.addemail,$scope.addrole, $scope.addpass)
        // handle success
        .then(function () {
          $window.location.href= '/users';
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

	$scope.useremail = "";
	$scope.userpassword = "";

  //login
  $scope.login = function () {

      $scope.inValidPassword = false;

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.email, $scope.loginpassword)
        // handle success
        .then(function (data) {
          $window.location.href = "/dashboard";
          $scope.disabled = false;
          $scope.loginForm = {};
          console.log(data);
        })
        // handle error
        .catch(function (data) {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
          $scope.inValidPassword = true;
        });

    };

    //reset Password
    $scope.resetemail-"";
    $scope.reset = function(){
      $http.post('/reset/password',{email: $scope.resetemail}).success(function(data){
        console.log(data);
      });
    }


    //set new password
    $scope.password = {}
    $scope.passwordConfirm = false;
    $scope.newPassword = function(){
      if ($scope.password.new==$scope.password.confirm) {
        
        $scope.password.token = $routeParams.id;
        $http.post('/setNewPassword',{newPassword: $scope.password}).success(function(data){
          //console.log(data);
          $window.location.href= "/login"
        });
      }
      else {
        $scope.passwordConfirm = true;
      }
    }
}])