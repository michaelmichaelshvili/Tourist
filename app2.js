// console.log("im here app2");
let app = angular.module('myApp', ["ngRoute"]);
app
    .run(function ($rootScope, sharedProperties, $location,$http) {
        console.log("here")
        $rootScope.logout = function () {
            sharedProperties.logout();
            $location.path("/");
        };
        $rootScope.logUser = function (username) {
            sharedProperties.logUser(username);
        };
        $rootScope.getUsername = function () {
            return sharedProperties.getUsername();
        };
        $rootScope.getStatus = function () {
            return sharedProperties.getStatus();
        };
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (next.templateUrl) {
                if ($rootScope.getStatus() == true) {
                    //logged users
                    if (next.templateUrl.startsWith("pages/login/") || next.templateUrl.startsWith("pages/register/") || next.templateUrl.startsWith("pages/forgotPassword/")) {
                        $location.path("/");
                    }
                }
                else {
                    //unlogged users
                    if (next.templateUrl.startsWith("pages/poi/") || next.templateUrl.startsWith("pages/explore/")) {
                        $location.path("/");
                        // $location.path("/login");
                    }
                }
            }
        });
        $rootScope.p1 = $http({
            method: "GET",
            url: "http://localhost:3000/getAllCategories"
        });
        $rootScope.p1.then(function success(response) {
            console.log(response.data);
            $rootScope._categories = response.data;
        }, function erro(response) {
            console.log("error getAllCategories");
        });
        $rootScope.p2 = $http({
            method: "GET",
            url: "http://localhost:3000/getAllPOI"
        });
        $rootScope.p2.then(function success(response) {
            $rootScope._allPOIs = response.data;
        }, function erro(response) {
            console.log("error getAllPOI");
        });
        // Promise.all([$rootScope.p1,$rootScope.p2]).then(function(values){
        //     alert("bom");
        // });
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'pages/home/home.html',
            })
            .when('/poi/:poi_name', {
                templateUrl: '/pages/poi/poi.html',
            })
            .when('/login', {
                templateUrl: 'pages/login/login.html',
            })
            .when('/register', {
                templateUrl: 'pages/register/register.html'
            })
            .when('/forgotPassword/:username', {
                templateUrl: 'pages/forgotPassword/forgotPassword.html'
            })
            .when('/forgotPassword', {
                templateUrl: 'pages/forgotPassword/forgotPassword.html'
            })
            .when('/explore', {
                templateUrl: 'pages/explore/explore.html'
            })
            // other
            .otherwise({ redirectTo: '/' });
    });

angular.module('myApp')
    .service('sharedProperties', function () {
        var username = undefined;
        var status = false;
        // var role = 'guest';
        return {
            getUsername: function () {
                return username;
            },
            logUser: function (value) {
                username = value;
                status = true;
            },
            logout: function () {
                username = undefined;
                status = false;
            },
            getStatus: function () {
                return status;
            }

        };
    });

angular.module("myApp")
    .controller("registerController", function ($scope, $http, $timeout) {

    });