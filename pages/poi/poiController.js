let app = angular.module('myApp');

app.controller('poiController',function($scope,$routeParams){
    console.log($routeParams.poi_name);
});