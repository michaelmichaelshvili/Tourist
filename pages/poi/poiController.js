var map;
var geocoder;

angular.module("Jerusalem Advisor")
        .controller('poiController', function ($scope, $routeParams, $http, $rootScope, $window) {
                // console.log($routeParams.poi_name);
                $http({
                        method: "GET",
                        url: "http://localhost:3000/getPOIDetail",
                        params: { name: $routeParams.poi_name }
                }).then(function success(response) {
                        $scope.poi = response.data;
                        // console.log($scope.poi);
                }, function erro(response) {
                        console.log("error");
                });

                $scope.openModal = function () {
                        if (!$rootScope.getStatus()) {
                                alert("you need to register to review");
                                //maybe conect to login
                                return;
                        }
                        document.getElementById("About").showModal();
                        var span = document.getElementsByClassName("close")[0];
                        span.onclick = function () {
                                document.getElementById("About").close();
                        }
                }
                $scope.sendRate = function () {
                        var checked = document.querySelectorAll('input:checked');
                        if (checked.length == 0) {
                                alert("To submit your rate you must give a rating between 1-5. OR you can exit witout ratinf");
                        }
                        else {

                                $scope.comment = document.getElementById('textarea').value.trim();
                                $scope.rateStar = parseInt(checked[0].value);
                                $http({
                                        method: "POST",
                                        url: "http://localhost:3000/private/RankPOI",
                                        data: { poi_name: $routeParams.poi_name, rate: $scope.rateStar, review_content: $scope.comment },
                                        headers: { "x-auth-token": $window.localStorage.getItem('token')}
                                }).then(function success(response) {
                                }, function erro(response) {
                                        alert(response.data);
                                });
                                $scope.closeModal();
                        }

                }
                $scope.closeModal = function () {
                        document.getElementById("About").close();
                }
        })


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