// let app = angular.module('myApp');
this.poi_name = "Jerusalem";
app.controller('poiController',function($scope,$routeParams){
    console.log($routeParams.poi_name);
});