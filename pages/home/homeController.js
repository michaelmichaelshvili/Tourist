angular.module("myApp")
    .controller('homeController', function ($scope, $routeParams, $http, $location, sharedProperties) {
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
        $http({
            method: "GET",
            url: "http://localhost:3000/getMostPopularPOI"
        }).then(function success(response){
            $scope.popularPois = response.data;
            // console.log(response.data);
        }, function erro(response){
            console.log("error");
        }); 



    })