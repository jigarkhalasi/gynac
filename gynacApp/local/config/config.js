var app = angular.module("gynacApp", ['ui.router', 'ui.bootstrap']);

	 app.config(function($stateProvider, $urlRouterProvider){
		 
      $urlRouterProvider.otherwise("/home")
      
      $stateProvider
        .state('home', {
            url: "/home",
            templateUrl : "gynacApp/local/controller/home/home.html",
			controller : "homeController"
        })
        .state('emailVerification', {
            url: "/emailVerification/:id/:email",
            templateUrl : "gynacApp/local/controller/home/home.html",
			controller : "homeController"
        })
        .state('about', {
            url: "/about",
            templateUrl : "gynacApp/local/controller/about/aboutPage.html",
			controller : "aboutController"
        })
        .state('lecture', {
            url: "/lecture",
			templateUrl : "gynacApp/local/controller/lecture/lecturepage.html",
			controller : "lectureController"
        })
        .state('lecturePayment', {
            url: "/lecturePayment/:status/:id",
			templateUrl : "gynacApp/local/controller/lecture/lecturepage.html",
			controller : "lectureController"
        })
        .state('contact', {
            url: "/contact",
            templateUrl : "gynacApp/local/controller/contact/contactPage.html",
            controller : "contactController"
        })
        .state('myProfile', {
            url: "/myProfile",
            templateUrl : "gynacApp/local/controller/myProfile/myProfilePage.html",
            controller : "myProfileController"
        })
        .state('signIn', {
            url: "/signIn",
            templateUrl : "gynacApp/local/controller/signIn/signInPage.html",
            controller : "signInController"
        })
        .state('forgotPassword', {
            url: "/forgotPassword/:id/:email",
            templateUrl : "gynacApp/local/controller/signIn/signInPage.html",
            controller : "signInController"
        })
        .state('signUp', {
            url: "/signUp",
            templateUrl : "gynacApp/local/controller/signUp/signUpPage.html",
            controller : "signUpController"
        })
        .state('training', {
            url: "/training",
            templateUrl : "gynacApp/local/controller/training/trainingPage.html",
            controller : "trainingController"
        })     
        .state('faculty', {
            url: "/faculty",
            templateUrl : "gynacApp/local/controller/faculty/facultyPage.html",
            controller : "facultyController"
        })
    })