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
                        loadMap($scope.poi.name);
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

function loadMap(poi_name) {
        var pune = { lat: 31.778345, lng: 35.2250786 };
        map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: pune
        });

        geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': poi_name,componentRestrictions: {
                country: 'IL'
              } }, function (results, status) {
                if (status == 'OK') {
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                        });

                } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                }
        });
}