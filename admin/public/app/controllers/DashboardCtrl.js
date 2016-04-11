angular.module('DashboardCtrl', [],function($locationProvider){
	$locationProvider.html5Mode(true);
}).controller('DashboardController', ['$scope','$http','$location', function($scope,$http,$location) {

	//init charts
	var chart1 = document.getElementById("line-chart").getContext("2d");
	window.myLine = new Chart(chart1).Line(lineChartData, {
		responsive: true
	});
	/*active sidebar*/
	var pId = $location.path(); 
	if(pId=="/"){
		$('.nav.menu > li').removeClass('active');
		$('.nav.menu > li:nth-child(1)').addClass('active');
	}

}]);