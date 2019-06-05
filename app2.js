let app = angular.module('myApp', ["ngRoute"]);
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            // this is a template url
            templateUrl: 'pages/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        // poi
        .when('/poi/:poi_name', {
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl'
        })
        .when('/login', {
            // this is a template url
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .when('/register', {
            // this is a template url
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as registerCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});