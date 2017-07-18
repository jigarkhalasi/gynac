app.controller('mainCtrl', function($scope, $rootScope, $state, dataService) {
	
	$('#startupmodeltrigger').trigger('click');
    
        
    $scope.allLecturesList = [
        'Scanning the Pelvis Basics along with Tips and Tricks', // 1
        'Torsion A Diagnostic Dilemma Made Easy', // 2
        'Spectrum of Endometriosis Beyond the “Ground Glass” Appearance', // 3
        'Congenital Uterine Anomalies - Simplified', // 4
        'Cycle Assessment in infertility and ART', // 5
        'Tubal Assessment', // 6
        'Ultrasound Settings and Technique', // 7
        'Evaluating Ovarian-Adnexal Lesions based on IOTA guidelines - Practice', // 8
        'Evaluating Ovarian-Adnexal Lesions based on IOTA guidelines', // 9
        'Possibilities with Ovarian Masses & Spectrum of Ovarian Neoplasia  - Part 1', // 10
        'Possibilities with Ovarian Masses & Spectrum of Ovarian Neoplasia - Part 2' // 11
    ];
    
    
    
    $rootScope.speakerVideoList = [];
    
    $scope.getJsonData = function(webURL, i){
        dataService.getData(webURL).then(function (data) {
			
            $rootScope.speakerVideoList[i] = data;
            console.log(".....", $rootScope.speakerVideoList)
		}, function (errorMessage) {
			console.log(errorMessage + ' Error......');
		});
    }
    
    for(var i = 0; i < $scope.allLecturesList.length; i++){
        var webURL = 'gynacApp/local/json/'+$scope.allLecturesList[i]+'.json';
		$scope.getJsonData(webURL, i);
    }
    
    
    // User Obj
    
    $rootScope.authenticatedUser = {};
    $rootScope.authenticatedUser.UserInfo = {};
    $rootScope.totalAmount = 0;
    
    $scope.signOut = function(){
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }
    
    // Right click disble
    
    /*$(document).on("contextmenu",function(){
       return false;
    });
    */
    
    // Country List
    
    $rootScope.CountryList = ['Australia','Belgium','Canada','China','Germany','Hong Kong','India','Iran','Italy','Japan','Malaysia','Netherlands','New Zealand','Singapore','Sweden','UK','USA','Others'];
    
    $rootScope.adminUserList = ['nipun710@gmail.com', 'pungul@gmail.com', 'sonalyogesh@yahoo.com', 'mala@sibal.com'];
    
});