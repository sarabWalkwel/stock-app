angular.module("appRoutes",[]).config(['$routeProvider','$locationProvider' ,function($routeProvider,$locationProvider){
	$routeProvider
		.when('/dashboard',{
			templateUrl:'views/dashboard.html',
			controller:'DashboardController',
			access: {restricted: true}
		})
		.when('/companies',{
			templateUrl:'views/companies.html',
			controller:'CompanyController',
			access: {restricted: true}
		})
		.when('/experts',{
			templateUrl:'views/experts.html',
			controller:'ExpertController',
			access: {restricted: true}
		}).
		when('/sharePrice/:companyid',{
			templateUrl:'views/add-share-price.html',
			controller:'ShareController',
			access: {restricted: true}
		}).
		when('/prediction',{
			templateUrl:'views/add-prediction.html',
			controller:'PredictionController',
			access: {restricted: true}
		})
		.when('/users',{
			templateUrl:'views/users.html',
			controller:'UserController',
			access: {
				restricted: false,
				role: 'Admin'
			}
		})
		.when('/login',{
			templateUrl:'views/login.html',
			controller:'UserController',
			access: {restricted: false}
		})
		.when('/register',{
			templateUrl:'views/signup.html',
			controller:'UserController',
			access: {restricted: false}
		})
		.when('/passwordreset',{
			templateUrl:'views/reset.html',
			controller:'UserController',
			access: {restricted: false}
		})
		.when('/setNewPassword/:id',{
			templateUrl:'views/setnewpassword.html',
			controller: 'UserController',
			access: {restricted: false}
		})
		.otherwise({
			redirectTo: '/login',
			access: {restricted: false}
		});

	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	}).hashPrefix('*');
}])
.run(function ($rootScope, $location, $route, AuthService,$timeout) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
    	$rootScope.admin = false;
    	$rootScope.admin = true;
       AuthService.getUserStatus();
      $timeout(function(){
      	var role =  AuthService.getUserRole();
      	$rootScope.loggedIn = AuthService.isLoggedIn();
      	if (next.access.restricted && !AuthService.isLoggedIn()) {
	        $location.path('/login');
	      }
	    if(role!="Admin"&&next.access.role=="Admin"){
	    	$location.path('/dashboard');	
	    }
	    if(role=="Admin"){
	    	$rootScope.admin = true;
	    }
      },10);
  });
});