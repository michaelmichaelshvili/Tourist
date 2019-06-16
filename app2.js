// console.log("im here app2");
let app = angular.module('myApp', ["ngRoute","dndLists"]);
app
    .run(function ($rootScope, sharedProperties, $location,$http) {
        $rootScope.LocalFavorites = [];//maybe make more private
        $rootScope.favorite_select = function (poi_name) {
            //save\unsave localy on client side
            if ($rootScope.LocalFavorites.includes(poi_name))
                $rootScope.LocalFavorites = $rootScope.LocalFavorites.filter(x => x != poi_name);
            else{
                $rootScope.LocalFavorites.push(poi_name);
                $rootScope.$broadcast("added_favorites");
            }
        }
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
            const reducer = (ac, cv) => ac || next.templateUrl.startsWith(cv);
            if (next.templateUrl) {
                if ($rootScope.getStatus() == true) {
                    //logged users
                    //TODO: add ,"pages/login/" ************************************************************
                    if ([false, "pages/register/","pages/forgotPassword/"].reduce(reducer)) {
                        alert("you are already logged in");
                        $location.path("/");
                    }
                }
                else {
                    //unlogged users
                    if ([false,"pages/poi/","pages/explore/","pages/favorites/"].reduce(reducer))
                    {
                        alert("you need to login");
                        $location.path("/login");
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
                templateUrl: 'pages/login/login.html',
                // templateUrl: 'pages/home/home.html',
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
            .when('/favorites', {
                templateUrl: 'pages/favorites/favorites.html'
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
    .controller("mainController", function ($rootScope, $scope, $http, $timeout) {
        $rootScope.$on("added_favorites",function(){
            $scope.num_of_favorite = $rootScope.LocalFavorites.length;
            $timeout(function(){$scope.num_of_favorite = undefined;},3000);
        })
    });