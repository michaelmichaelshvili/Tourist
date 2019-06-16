angular.module("myApp")
    .controller('homeController', function ($rootScope,$window,$scope, $routeParams, $http, $location, sharedProperties) {
        // console.log("home");
        $http({
            method: "GET",
            url: "http://localhost:3000/getRandomPOI"
        }).then(function success(response){
            $scope.explorePois = response.data;
            // console.log(response.data);
        }, function erro(response){
            console.log("error");
        });
        if($rootScope.getStatus())
        {
            $http({
                headers: { "x-auth-token": $window.localStorage.getItem('token')},  
                method: "GET",
                url: "http://localhost:3000/private/getMostPopularPOI"
            }).then(function success(response){
                $rootScope.popularPois = response.data;
                // console.log(response.data);
            }, function erro(response){
                console.log("error");
            }); 
        }



    })