app.controller("lectureController",["$scope", "$sce", "$rootScope", "dataService", "$filter", "$state", "$interval", "$stateParams", "$filter", function($scope, $sce, $rootScope, dataService, $filter, $state, $interval, $stateParams){
	
	$scope.clickMe = function(){
		var webURL = 'appData/zoneData.json'
		dataService.getData(webURL).then(function (data) {
			console.log(data)
		}, function (errorMessage) {
			console.log(errorMessage + ' Error......');
		});
	}
    
    
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };
    
    $scope.authenticLecture = function(){
        
        for(var j = 0; j < $rootScope.speakerVideoList.length; j++){
            $rootScope.speakerVideoList[j].isActive = false;
        }
        if($rootScope.authenticatedUser.UserInfo.User_Id ){
            var penddingLecLength = $rootScope.authenticatedUser.ActiveUserCourse.length;
            for(var i = 0; i < penddingLecLength; i++){
                var lecLength = $rootScope.speakerVideoList.length;
                for(var j = 0; j < lecLength; j++){
                    if(($rootScope.authenticatedUser.UserInfo.User_Id == $rootScope.authenticatedUser.ActiveUserCourse[i].User_Id) && ($rootScope.authenticatedUser.ActiveUserCourse[i].Course_Id == $rootScope.speakerVideoList[j].Course_Id)){
                        $rootScope.speakerVideoList[j].isActive = true;
                    }
                }
            }
        }
        
        if($rootScope.adminUserList.indexOf($rootScope.authenticatedUser.UserInfo.Email) != -1){
            var lecLength = $rootScope.speakerVideoList.length;
            for (var j = 0; j < lecLength; j++) {
                $rootScope.speakerVideoList[j].isActive = true;
            }
        }
        
        for(var i = 0; i < $rootScope.modulesList.length; i++){
        var listArry = [];
        for(var j = 0; j < $rootScope.modulesList[i].lecList.length; j++){
            listArry.push($filter('filter')($rootScope.speakerVideoList, {Course_Id : $rootScope.modulesList[i].lecList[j]})[0])
        }
        $rootScope.modulesList[i].lecList = listArry;
            
        setTimeout(function(){
            var acc = document.getElementsByClassName("accordion");
            var i;

            for (i = 0; i < acc.length; i++) {
              acc[i].onclick = function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight){
                  panel.style.maxHeight = null;
                } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                } 
              }
            }
        },500)
    }
    
    console.log('$rootScope.modulesList..', $rootScope.modulesList);
        
        console.log($rootScope.speakerVideoList)
    }
    
    $('.prevent').on('click', function(e){
        e.preventDefault();
    })
    
    $scope.selectModuleeSection = function(isSelected, data){
        for(var i = 0; i < data.lecList.length; i++){
            if(data.lecList[i].isUnderDevelopment){
                data.lecList[i].isSelected = false;
            }else{
                data.lecList[i].isSelected = isSelected 
            }
        }
        var selectedLec = $filter('filter')($rootScope.speakerVideoList,{isSelected : true});
        console.log(selectedLec);
        $rootScope.totalAmount = 0;
        for(var i = 0; i < selectedLec.length; i++){
            $rootScope.totalAmount += selectedLec[i].amount;
        }
    }
    
    $scope.verifyloginbyguid = function () {
        var webURL = 'api/gynac/verifyloginbyguid';
        var dataToBeSend = {}
        dataToBeSend.Guid  = $stateParams.id;
        dataService.postData(webURL, dataToBeSend).then(function (data) {
            console.log(data)           

            if ($stateParams.status == 'success') {
                if (data) {
                    $rootScope.authenticatedUser = data;
                    $scope.authenticLecture();
                    $('#triggerPaymentSuccessfully').trigger('click');
                } else {
                    $('#triggerPaymentError').trigger('click'); // Payment Successfull but login failed. Please relogin again.
                }                
            } else {                
                if (data) {
                    $rootScope.authenticatedUser = data;
                    $scope.authenticLecture();
                    $('#triggerPaymentError').trigger('click'); // Payment failed.
                } else {
                    $('#triggerPaymentError').trigger('click'); // Payment & login failed. Please try login & payment again.
                }
                
            }
        }, function (errorMessage) {
            if ($stateParams.status == 'success') {
                $('#triggerPaymentError').trigger('click'); // Payment Successfull but login failed. Please relogin again.
            } else {
                $('#triggerPaymentError').trigger('click'); // Payment & login failed. Please try login & payment again.
            }
			console.log(errorMessage + ' Error......');
		});
	}
    
    
    if ($state.is('lecturePayment')) {
        $scope.verifyloginbyguid();
        
    }else{
        $scope.authenticLecture();
    }
    
    $scope.signOut = function(){
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }

	$scope.lecture = true;
    
    $scope.closeCounterModel = function(){
        $interval.cancel(promise);
        $scope.counter = 0;
    }
    
    var promise;
    $scope.playAfterTerms = function(){
        //$scope.lecture = false;
		//$scope.fullview = true;
        //$('#playAudio').get(0).play();
        //$('#subVideo').get(0).pause();
        setTimeout(function(){
            $('#triggerCountdown').trigger('click');
            
        },100)
        setTimeout(function(){
                document.getElementById('Countdown').style.display = 'block';
                console.log('display block')
            },500)
        $scope.counter = 30;
        if(promise){
            $interval.cancel(promise);
        }
        promise = $interval(callAtInterval, 1000);
    }
    
    function callAtInterval(){
        $scope.counter--;
        if($scope.counter <= 0){
            $interval.cancel(promise);
            $('#playTriggerBtn').trigger('click');
            $scope.lecture = false;
		    $scope.fullview = true;
            $('.modal-backdrop.fade').remove();
        }
    }
    
    var myVar = '';

	$scope.openLecture = function(obj){
        //console.log('obj...', obj);
        $scope.audioEndTime = obj.audioEndTime;
        $('.pause').removeClass('play-pause-disable');
        $('.play').addClass('play-pause-disable');
        $scope.checkedTermsCondition = false;
        $scope.currentLecture = obj;
        
        $scope.showQusAnsSection = true;
        $scope.qusIndex = 0;
        $scope.qusList = obj.qusList;
        
		//$scope.lecture = false;
		//$scope.fullview = true;
        $('#playAudio').attr('src','');
        $('.slide-scree .img').attr('src','')
        $('#playAudio').attr('src',obj.audioSrc);
        $('#playAudio').get(0).pause();
        $('#subVideo').get(0).pause();
        console.log('angular', obj);
        videoList = obj.videoList;
        audioTiming = obj.audioTiming;
        slideMapping = [];
        imgFolderName = obj.imgFolderName;
        var length = obj.audioTiming.length + 1;
        for(var i = 1; i < length; i++){
            slideMapping.push(i);
        }
        $('.slide-screen .img').attr('src','gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[0]+'.jpg');
        $scope.preloadVideo(obj);
       // $scope.preloadImage();
        
        //console.log('slideMapping', slideMapping);
        if(myVar){
            clearInterval(myVar);
        }
	}
    
    $scope.navQus = function(status){
        $scope.wrongAns = '';
        if($scope.qusList[$scope.qusIndex].userAns != $scope.qusList[$scope.qusIndex].ans){
            //alert('Please select correct answer');
            $scope.wrongAns = $scope.qusList[$scope.qusIndex].wrongAnsMsg;
            return
        }
        if(status){
            $scope.qusIndex++;
        }else{
            $scope.qusIndex--;
        }
    }

    $scope.submitList = function(){
        $scope.wrongAns = '';
        if($scope.qusList[$scope.qusIndex].userAns != $scope.qusList[$scope.qusIndex].ans){
            //alert('Please select correct answer');
            $scope.wrongAns = $scope.qusList[$scope.qusIndex].wrongAnsMsg;
            return
        }else{
            //alert('Data submited successfully!!');
            $scope.showQusAnsSection = false;
        }
    }

    $scope.preloadVideo = function(obj){
        for(var i = 0; i < obj.videoList.length; i++){
            $('.training').append('<video preload="auto" style="display:none"><source src="'+obj.videoList[i].videoSrc+'" type="video/mp4"> Your browser does not support the video tag.</video>')
        }
    }
    
    $scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};
    
    var tempImgList = [];
    $scope.preloadImage = function (){
       // var halfLength = slideMapping.length/4;
        var halfLength = slideMapping.length;
        tempImgList = [];
        for(var i = 0; i < halfLength; i++){
            tempImgList.push('gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[i]+'.jpg')
        }
        preload();
    }
    
    var images = new Array();
    function preload() {
        for (i = 0; i < tempImgList.length; i++) {
            images[i] = new Image()
            images[i].src = tempImgList[i]
        }
    }       
    
    $scope.showPayBtn = function(arry){
        var selected = $filter('filter')(arry,{isSelected : true}).length;
        return selected? true : false;
    }
    
    $scope.selectLecture = function(list){
        if(list.isUnderDevelopment){
            $('#triggerUnderDevelopment').trigger('click');
            return;
        }
        list.isSelected = !list.isSelected;
        var selectedLec = $filter('filter')($rootScope.speakerVideoList,{isSelected : true});
        console.log(selectedLec);
        $rootScope.totalAmount = 0;
        for(var i = 0; i < selectedLec.length; i++){
            $rootScope.totalAmount += selectedLec[i].amount;
        }
    }
    
    $scope.saveLecture = function () {
        if($rootScope.authenticatedUser.UserInfo.User_Id){
            if($rootScope.authenticatedUser.UserInfo.Country != 'India'){
                $('#triggerNoPayment').trigger('click');
                return;
            }
            var selectedLec = $filter('filter')($rootScope.speakerVideoList, { isSelected: true });

            var webURL = 'api/gynac/saveusercourse'
            var data = [];

            for (var i = 0; i < selectedLec.length; i++) {
                data.push({ User_Id: $rootScope.authenticatedUser.UserInfo.User_Id, Course_Id: selectedLec[i].Course_Id, Payment_Amount: selectedLec[i].amount, Validity_Days: selectedLec[i].validityDays })
            }
            console.log(data)
            dataService.postData(webURL,data).then(function (data) {
                console.log(data);
                window.location.href = 'Pay.aspx?id=' + data.PaymentGuid;
                
                //$('#triggerLateBuy').trigger('click');
                
                for(var j = 0; j < $rootScope.speakerVideoList.length; j++){
                    $rootScope.speakerVideoList[j].isSelected = false;
                }
                $rootScope.totalAmount = 0;
            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
                for(var j = 0; j < $rootScope.speakerVideoList.length; j++){
                    $rootScope.speakerVideoList[j].isSelected = false;
                }
                $rootScope.totalAmount = 0;
            });
        } else{
            //$state.go('signIn');
            $('#triggerRequiredSigninModal').trigger('click');
        }

    }
    
    $scope.goToLogin = function(){
        $state.go('signIn');
    }
    
    $(function(){
    	$("#subVideo").on("timeupdate", function(event){
          onTrackedSubVideoFrame(this.currentTime, this.duration);
        });
	});
    
    function onTrackedSubVideoFrame(currentTime1, duration1){
	    var subVideoSecond = currentTime1;
	    minutes1 = Math.floor(subVideoSecond / 60);
	    minutes1 = (minutes1 >= 10) ? minutes1 : "0" + minutes1;
	    subVideoSecond = Math.floor(subVideoSecond % 60);
	    subVideoSecond = (subVideoSecond >= 10) ? subVideoSecond : "0" + subVideoSecond;
	    
	    var time11 = minutes1 + ":" + subVideoSecond;
	    console.log('....',time11);
        
        if(time11 == '00:02'){
            isPlaying = false;
        }
        
    }

	$(function(){
    	$("#playAudio").on("timeupdate", function(event){
          onTrackedVideoFrameQA(this.currentTime, this.duration);
        });
	});

	var videoStatus = {
		v1 : false
	}
    
    var isPlaying = false;
    
	function onTrackedVideoFrameQA(currentTime, duration){
	    var seconds = currentTime;
	    minutes = Math.floor(seconds / 60);
	    minutes = (minutes >= 10) ? minutes : "0" + minutes;
	    seconds = Math.floor(seconds % 60);
	    seconds = (seconds >= 10) ? seconds : "0" + seconds;
	    
	    var time1 = minutes + ":" + seconds;
	    console.log(time1);
	    console.log(time1 == $scope.audioEndTime);
        if(time1 == $scope.audioEndTime){
            $scope.$apply(function(){
                $scope.fullview = null;
            })
            
            //$('#triggerAssessment').trigger('click');
        }
        
        var length = videoList.length;
        for(var i = 0; i < length; i++){
            if(!isPlaying && time1 == videoList[i].timing){
                $('#subVideo').show();
                $('#subVideo').attr('src', videoList[i].videoSrc);
                $('#subVideo').get(0).currentTime = 0;
                $('#subVideo').get(0).play();
                
                $('.subVideo').show();
                $('.subVideo').attr('src', videoList[i].videoSrc);
                $('.subVideo').get(0).currentTime = 0;
                $('.subVideo').get(0).play();
                
                $('#subVideo').css({
                    "width": videoList[i].width
                });
                $('.normalview').css({
                    "top": videoList[i].posY,
                    "left": videoList[i].posX
                });
                
                $('.fullViewVideo').css({
                    "width": videoList[i].fullVieWidth
                });
                $('.fullview').css({
                    "top": videoList[i].fullViewPosY,
                    "left": videoList[i].fullViewPosX
                });
                isPlaying = true;
                break;
            }
        }
        

	    $('.time').text(minutes + ":" + seconds);
	}


	
/*
var videoArryList = ['07:21','11:05','11:42','15:00','17:45','18:58','20:51','21:43','22:52'];
var videoName = [
	'ftp://Gynac@flax.arvixe.com/videos/Torsion/Slide%2012.mp4',
	'ftp://Gynac@flax.arvixe.com/videos/Torsion/Slide%2017_1.mp4',
	'ftp://Gynac@flax.arvixe.com/videos/Torsion/Slide%2017_2.mp4'
]
*/


function convertToSecond(input) {
	if(!input){
		input = audioTiming[audioTiming.length - 1];
	}
    var parts = input.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    return (minutes * 60 + seconds).toFixed(3);
}

var slideMapping = [];
var imgFolderName = '';
/*var slideMapping = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121'];*/
//console.log(slideMapping.length)


	$(document).ready(function(e) {    
        var slideMarginLeft = 0;
        function renderImg(){
            var k="";
            for(i=0;i<slideMapping.length;i++){		
                k+='<div class="slides slide'+(i+1)+' left ';
                if(i == 0){
                    k+=' " data-index="'+(i+1)+'"><img class="selected-slide img-slide-no'+i+'" src="gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[i]+'.jpg" alt="" /><div>Slide'+(i+1)+'</div></div>';
                }else{
                    k+=' " data-index="'+(i+1)+'"><img class="img-slide-no'+i+'" src="gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[i]+'.jpg" alt="" /><div>Slide'+(i+1)+'</div></div>';
                }		
            }

            $('.strip-container').html(k);
            $('.strip-container').css({'width':154*$('.slides').length+0+'px'});
            slideMarginLeft =  154*( $('.slides').length -5 );
            console.log(slideMarginLeft)
            $('.strip-container').animate({'margin-left':'2px'});		
        }

		$('.right-arrow').click(function(e){
			$('.strip-container').finish();
			var p=$('.strip-container').css('margin-left');
			p=p.substr(0,p.length-2);
			p-=100;
			var t=$('.strip-container').css('width');
			t=parseInt(t.substr(0,t.length-2));
			if(p>=-slideMarginLeft)
			$('.strip-container').animate({'margin-left':p+'px'});				
		});

		$('.left-arrow').click(function(e){
			$('.strip-container').finish();
			var p=$('.strip-container').css('margin-left');
			p=p.substr(0,p.length-2);
			p=parseInt(p);
			p+=100;
			var t=$('.strip-container').css('width');
			t=parseInt(t.substr(0,t.length-2));
			if(p<=10)
			$('.strip-container').animate({'margin-left':p+'px'});		
		});
        
        var promise1;
        var counter1 = 0;
        
		//$('.slides').click(function(e) {
		$('.lecture').on('click','.slides',function(e){
            $('#subVideo').hide();
            $('#subVideo').get(0).pause();
            $('.subVideo').hide();
            $('.subVideo').get(0).pause();
            isPlaying = false;
			$('.slide-screen .img').attr('src',$(this).find('img').attr('src'));
			$('.slides img').removeClass('selected-slide');	
			$(this).find('img').addClass('selected-slide');		
			var c=$(this).attr('data-index');
			currentIndex = c;
			$('.slide-screen .img').attr('src','gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[currentIndex - 1]+'.jpg');
			$('#playAudio').get(0).currentTime=parseFloat(convertToSecond(audioTiming[c-1]))+1;	
			/*if ($('#playAudio').get(0).readyState >= $('#playAudio').get(0).HAVE_FUTURE_DATA) {
				$('#playAudio').get(0).play();
			} else {
				$('#playAudio').on('canplay', function(){					
					$('#playAudio').get(0).play();
				});
			}	*/
            setTimeout(function(){
                $('.pause').trigger('click');
                $('#playAudio').get(0).pause();
                $('#subVideo').get(0).pause();
                $('.subVideo').get(0).pause();
                $('.play').removeClass('play-pause-disable');
                $('.pause').addClass('play-pause-disable');
                counter1 = 3;
                if(promise1){
                    $interval.cancel(promise1);
                }
                promise1 = setInterval(callAtInterval1, 1000);
            },100)
            $('#loading').show();
            //$('#triggerSubCountdown').trigger('click');
            
		});
        
        
        
    
    
        function callAtInterval1(){
            counter1--;
            $('#subcounter1').text(counter1)
            if(counter1 <= 0){
                clearInterval(promise1);
                $('.play').trigger('click');
                $('#playAudio').get(0).play();
                $('#subVideo').get(0).play();
                $('.subVideo').get(0).play();
                $('.pause').removeClass('play-pause-disable');
                $('.play').addClass('play-pause-disable');
                $('#loading').hide();
                //$('#playSubTriggerBtn').trigger('click');
            }
        }

		function timeinterval(){
			currentIndex = 1;
			myVar = setInterval(function(){
				time1 = $('#playAudio').get(0).currentTime;
				if((time1 > convertToSecond(audioTiming[currentIndex]))){
				 	currentIndex++;
                    $('#subVideo').hide();
                    $('#subVideo').get(0).pause();
                    $('.subVideo').hide();
                    $('.subVideo').get(0).pause();
                    isPlaying = false;
				    if (currentIndex == 5){
				       $('.strip .strip-container').css({marginLeft : '-598px'}) 
				    }else if(currentIndex == 9 ){
				    	$('.strip .strip-container').css({marginLeft : '-1198px'}) 
				    }else if(currentIndex == 13 ){
				    	$('.strip .strip-container').css({marginLeft : '-1798px'}) 
				    }else if(currentIndex == 17 ){
				    	$('.strip .strip-container').css({marginLeft : '-2398px'}) 
				    }else if(currentIndex == 21 ){
				    	$('.strip .strip-container').css({marginLeft : '-2998px'}) 
				    }else if(currentIndex == 25 ){
				    	$('.strip .strip-container').css({marginLeft : '-3598px'}) 
				    }else if(currentIndex == 29 ){
				    	$('.strip .strip-container').css({marginLeft : '-4198px'}) 
				    }else if(currentIndex == 33 ){
				    	$('.strip .strip-container').css({marginLeft : '-4798px'}) 
				    }else if(currentIndex == 37 ){
				    	$('.strip .strip-container').css({marginLeft : '-5398px'}) 

				    }else if(currentIndex == 41 ){
				    	$('.strip .strip-container').css({marginLeft : '-5998px'}) 
				    }else if(currentIndex == 45 ){
				    	$('.strip .strip-container').css({marginLeft : '-6598px'}) 
				    }else if(currentIndex == 49 ){
				    	$('.strip .strip-container').css({marginLeft : '-7198px'}) 
				    }else if(currentIndex == 53 ){
				    	$('.strip .strip-container').css({marginLeft : '-7798px'}) 
				    }else if(currentIndex == 57 ){
				    	$('.strip .strip-container').css({marginLeft : '-8398px'}) 
				    }else if(currentIndex == 61 ){
				    	$('.strip .strip-container').css({marginLeft : '-8998px'}) 
				    }else if(currentIndex == 65 ){
				    	$('.strip .strip-container').css({marginLeft : '-9598px'}) 
				    }else if(currentIndex == 69 ){
				    	$('.strip .strip-container').css({marginLeft : '-10198px'}) 

				    }else if(currentIndex == 73 ){
				    	$('.strip .strip-container').css({marginLeft : '-10798px'}) 
				    }else if(currentIndex == 77 ){
				    	$('.strip .strip-container').css({marginLeft : '-11398px'}) 
				    }else if(currentIndex == 81 ){
				    	$('.strip .strip-container').css({marginLeft : '-11998px'}) 
				    }else if(currentIndex == 85 ){
				    	$('.strip .strip-container').css({marginLeft : '-12598px'}) 
				    }else if(currentIndex == 89 ){
				    	$('.strip .strip-container').css({marginLeft : '-13198px'}) 
				    }else if(currentIndex == 93 ){
				    	$('.strip .strip-container').css({marginLeft : '-13798px'}) 
				    }else if(currentIndex == 97 ){
				    	$('.strip .strip-container').css({marginLeft : '-14398px'}) 
				    }else if(currentIndex == 101 ){
				    	$('.strip .strip-container').css({marginLeft : '-14998px'}) 

				    }else if(currentIndex == 105 ){
				    	$('.strip .strip-container').css({marginLeft : '-15598px'}) 
				    }else if(currentIndex == 109 ){
				    	$('.strip .strip-container').css({marginLeft : '-16198px'}) 
				    }else if(currentIndex == 113 ){
				    	$('.strip .strip-container').css({marginLeft : '-16798px'}) 
				    }else if(currentIndex == 117 ){
				    	$('.strip .strip-container').css({marginLeft : '-17398px'}) 
				    }

				 	$('.slides img').removeClass('selected-slide'); 
				 	var selectedImg = '.img-slide-no'+(currentIndex - 1)
				 	$(selectedImg).addClass('selected-slide');
				}
                
                



				//console.log('time1',currentIndex)
				//console.log('b',convertToSecond(audioTiming[currentIndex]))
				a = parseInt(currentIndex);
				if(time1 && a < ( slideMapping.length + 1 )){	
					$('.slide-screen .img').attr('src','gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[currentIndex - 1]+'.jpg');
				}else{
					$('.img-slide-no36').addClass('selected-slide');
					$('.slide-screen .img').attr('src','gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[slideMapping.length - 1]+'.jpg');
				}
				/*if(1564.000 < time1){ 		
					console.log('time out..........')
					$('#playAudio').get(0).pause();		
                    $('#subVideo').get(0).pause();
                    isPlaying = false;
				}*/
			},1000)
		}

		$('.open-lec').on('click', '.play-audio', function(){
            setTimeout(function(){ 
                renderImg(); // this should call forst
                $('.slide-scree .img').attr('src','gynacApp/local/img/'+imgFolderName+'/Slide'+slideMapping[0]+'.jpg');
                timeinterval();
                $('#subVideo').hide();
                $('#subVideo').get(0).pause();
                $('.subVideo').hide();
                $('.subVideo').get(0).pause();
                isPlaying = false;
                $('#playAudio').get(0).play();
                $('#playAudio').get(0).currentTime = 0;
                $('.slides img').removeClass('selected-slide');	
                $('.slide1 img').addClass('selected-slide');
                console.log('jquery');
            }, 100);			
		})

		$('.play').on('click', function(){
	        $('#playAudio').get(0).play();
            $('#subVideo').get(0).play();
            $('.subVideo').get(0).play();
            $('.pause').removeClass('play-pause-disable');
            $('.play').addClass('play-pause-disable');
		})

		$('.pause').on('click', function(){
			$('#playAudio').get(0).pause();
            $('#subVideo').get(0).pause();
            $('.subVideo').get(0).pause();
            $('.play').removeClass('play-pause-disable');
            $('.pause').addClass('play-pause-disable');
		})

		$('.back-btn').on('click', function(){
			$('#playAudio').get(0).pause();
            $('#subVideo').hide();
            $('#subVideo').get(0).pause();
            $('.subVideo').hide();
            $('.subVideo').get(0).pause();
			clearInterval(myVar);
		})
        
        var interval = '';
        
        $(".right.right-arrow").mousedown(function() {
            $('.next-animation').animate({'width':'80%',"margin-top": "2px"},50);
            if(interval)
            clearInterval(interval); 
            interval = setInterval(nextMouseDown, 100);
        }).mouseup(function() {
            $('.next-animation').animate({'width':'100%',"margin-top": "0px"},50);
            if(interval)
            clearInterval(interval);  
        }).mouseleave(function() {
            $('.next-animation').animate({'width':'100%',"margin-top": "0px"},50);
            if(interval)
            clearInterval(interval);  
        });
        
        function nextMouseDown() {
            console.log('right in...');
            $('.strip-container').finish();
			var p=$('.strip-container').css('margin-left');
			p=p.substr(0,p.length-2);
			p-=100;
			var t=$('.strip-container').css('width');
			t=parseInt(t.substr(0,t.length-2));
			if(p>=-slideMarginLeft)
			$('.strip-container').animate({'margin-left':p+'px'});	
        }
        
        $(".left.left-arrow").mousedown(function() {
            $('.next-animation').animate({'width':'80%',"margin-top": "2px"},50);
            if(interval)
            clearInterval(interval); 
            interval = setInterval(previousMouseDown, 100);
        }).mouseup(function() {
            $('.next-animation').animate({'width':'100%',"margin-top": "0px"},50);
            if(interval)
            clearInterval(interval);  
        }).mouseleave(function() {
            $('.next-animation').animate({'width':'100%',"margin-top": "0px"},50);
            if(interval)
            clearInterval(interval);  
        });
        
        function previousMouseDown(){
            $('.strip-container').finish();
			var p=$('.strip-container').css('margin-left');
			p=p.substr(0,p.length-2);
			p=parseInt(p);
			p+=100;
			var t=$('.strip-container').css('width');
			t=parseInt(t.substr(0,t.length-2));
			if(p<=10)
			$('.strip-container').animate({'margin-left':p+'px'});
        }
        
        $('#contentFromHome').html($('#termsCoditionsContain').html())

	});
	
}]);