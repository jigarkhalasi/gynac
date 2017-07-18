app.controller("contactController",["$scope", "dataService", "$rootScope", "$state", function($scope, dataService, $rootScope, $state){
	
    $scope.contactUs = function () {
        var webURL = 'api/gynac/sendcontactusemail'
		dataService.postData(webURL, $scope.contact).then(function (data) {
		    console.log(data);
		    if (data == 1) {
		        $("#triggerMailSentModal").trigger('click');
		    }
		    else {
		        $('#triggerInternalError').trigger('click');
		    }
		    
		}, function (errorMessage) {
			console.log(errorMessage + ' Error......');
		});
	}
    
    $scope.signOut = function(){
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }

    $scope.goToHome = function () {
        $state.go('home');
    }
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };
	
}]);