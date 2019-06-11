// console.log("im here app2");
let app = angular.module('myApp', ["ngRoute"]);
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            // this is a template url
            template: 'finally'
            // templateUrl: 'pages/home/home.html',
            // controller : 'homeController'
        })
        // poi
        .when('/poi/:poi_name', {
            // template:'this is happy'
            templateUrl: '/pages/poi/poi.html',
            controller : 'poiController'
        })
        .when('/login', {
            // this is a template url
            // template: 'finally'
            templateUrl: 'pages/login/login.html',
            controller : 'loginController'
        })
        .when('/register', {
            // this is a template url
            templateUrl: 'pages/register/register.html'
            // ,controller : 'registerController'
        })
        // other
        .otherwise({ redirectTo: '/' });
});
