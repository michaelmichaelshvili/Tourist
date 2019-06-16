var map;
var geocoder;
angular.module("myApp")
        .controller('poiController', function ($scope, $routeParams, $http) {
                console.log($routeParams.poi_name);
                $http({
                        method: "GET",
                        url: "http://localhost:3000/getPOIDetail",
                        params: { name: $routeParams.poi_name }
                }).then(function success(response) {
                        $scope.data = response.data;
                        // console.log($scope.data);
                }, function erro(response) {
                        console.log("error");
                });


        });
        // function loadMap() {
        // var pune = { lat: 18.5204, lng: 73.8567 };
        // map = new google.maps.Map(document.getElementById('map'), {
        //         zoom: 20,
        //         center: pune
        // });

        // var marker = new google.maps.Marker({
        //     position: pune,
        //     map: map
        // });

        // var cdata = JSON.parse(document.getElementById('data').innerHTML);
        // geocoder = new google.maps.Geocoder();
        // // codeAddress(cdata);

        // geocoder.geocode({ 'address': "Biratenu" }, function (results, status) {
        //         if (status == 'OK') {
        //                 map.setCenter(results[0].geometry.location);
        //                 console.log("here");
        //                 //   var points = {};
        //                 //   points.id = data.id;
        //                 //   points.lat = map.getCenter().lat();
        //                 //   points.lng = map.getCenter().lng();
        //                 //   updateCollegeWithLatLng(points);
        //         } else {
        //                 alert('Geocode was not successful for the following reason: ' + status);
        //         }
        // });
// }