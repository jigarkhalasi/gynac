app.controller("facultyController",["$scope", "dataService", "$rootScope", "$state", function($scope, dataService, $rootScope, $state){
	
	$scope.clickMe = function(){
		var webURL = 'appData/zoneData.json'
		dataService.getData(webURL).then(function (data) {
			console.log(data)
		}, function (errorMessage) {
			console.log(errorMessage + ' Error......');
		});
	}
    
    $scope.profilePage = true;
    
	$scope.viewMore = function(){
        $scope.profilePage = !$scope.profilePage;
    }
    
    $scope.signOut = function(){
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };
	
}]);