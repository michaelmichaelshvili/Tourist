// console.log("im here app2");
let app = angular.module('Jerusalem Advisor', ["ngRoute","dndLists"]);
app
    .run(function ($window, $rootScope, sharedProperties, $location,$http) {
        $rootScope.LocalFavorites = [];//maybe make more private
        $rootScope.LocalFavoritesIncludes = function(poi_name){
            return $rootScope.LocalFavorites.map(x=>x.name).includes(poi_name);
        }
        $rootScope.favorite_select = function (poi) {
            //save\unsave localy on client side
            if ($rootScope.LocalFavoritesIncludes(poi.name))
                $rootScope.LocalFavorites = $rootScope.LocalFavorites.filter(x => x.name != poi.name);
            else{
                $rootScope.LocalFavorites.push(poi);
                // $rootScope.$broadcast("added_favorites");
            }
        }

        $rootScope.logout = function () {
            sharedProperties.logout();
            $window.localStorage.removeItem('token');
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

        $rootScope.$on("$routeChangeError", function (event, next, current) {
            console.log("errrr");
        });
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            const reducer = (ac, cv) => ac || next.templateUrl.startsWith(cv);
            if (next.templateUrl) {
                if ($rootScope.getStatus() == true) {
                    //logged users
                    if ([false, "pages/login/", "pages/register/","pages/forgotPassword/"].reduce(reducer)) {
                        alert("you are already logged in");
                        $location.path("/");
                        event.preventDefault();
                    }
                }
                else {
                    //unlogged users
                    if ([false,"pages/favorites/"].reduce(reducer))
                    {
                        alert("you need to login");
                        $location.path("/login");
                        event.preventDefault();
                        // $location.path("/login");
                    }
                }
            }
        });
        $rootScope.p1 = $http({
            method: "GET",
            url: "http://localhost:3000/getAllCategories"
        });
        // $rootScope.p1.then(function success(response) {
        //     $rootScope._categories = response.data;
        // }, function erro(response) {
        //     console.log("error getAllCategories");
        // });
        $rootScope.p2 = $http({
            method: "GET",
            url: "http://localhost:3000/getAllPOI"
        });
        // $rootScope.p2.then(function success(response) {
        //     $rootScope._allPOIs = response.data;
        // }, function erro(response) {
        //     console.log("error getAllPOI");
        // });
        $rootScope.load = Promise.all([$rootScope.p1,$rootScope.p2]).then(function(responses){
            $rootScope._categories = responses[0].data;
            $rootScope._allPOIs = responses[1].data;
            $rootScope.$digest();
            // $scope.$digest();
        });
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                // templateUrl: 'pages/login/login.html',
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
            .when('/favorites', {
                templateUrl: 'pages/favorites/favorites.html'
            })
            .when('/about', {
                templateUrl: 'pages/about/about.html'
            })
            // other
            // .otherwise({ redirectTo: '/' });
    })
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
    })
    .controller("mainController", function ($rootScope, $scope, $http, $timeout) {
        // $rootScope.$on("added_favorites",function(){
        //     $scope.num_of_favorite = $rootScope.LocalFavorites.length;
        //     $timeout(function(){$scope.num_of_favorite = undefined;},3000);
        // })
        // $scope.getAPIKey = function(){
        //     var key = prompt("Please entar api key");
        //     if(key!=null)
        //     {
        //         console.log(key);
        //     }
        // }
    }
    );