angular.module("stockApp",['ngRoute','appRoutes','DashboardCtrl','CompanyCtrl','ExpertCtrl','datatables','datatables.bootstrap','ShareCtrl','PredictionCtrl','UserCtrl','AuthSrvc','PassCtrl']).controller("AppController",['$scope', '$location', 'AuthService' , '$timeout', '$window',
  function ($scope, $location, AuthService ,$timeout ,$window ) {

    $scope.logout = function () {
      // call logout from service
      AuthService.logout()
        .then(function () {
        	$window.location.href="/";
        });
    };

}]);