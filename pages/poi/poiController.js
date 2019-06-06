angular.module("myApp")
.controller('poiController', function ($routeParams,$http) {
        console.log($routeParams.poi_name);
        $http({
            method: "GET",
            url: "http://localhost:3000/getPOIDetail",
            params: {name:$routeParams.poi_name}

        }).then(function success(response){
            console.log(response);
        },function erro(response){
            console.log("error");
        });
        $http({
            method: "POST",
            url: "http://localhost:3000/restore_password",
            data: {name:"name"}

        }).then(function success(response){
            console.log(response);
        },function erro(response){
            console.log("error");
        });
});
