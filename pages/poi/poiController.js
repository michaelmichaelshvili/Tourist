angular.module("myApp")
.controller('poiController', function ($routeParams,$http) {
        console.log($routeParams.poi_name);
        $http({
            method: "GET",
            url: "http://localhost:3000/getPOIDetail",
            params: {name:'Biratenu'}

        }).then(function success(response){
            console.log(response);
        },function erro(response){
            console.log("error");
        });
});
