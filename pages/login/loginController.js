angular.module("myApp")
    .controller('poiController', function ($scope, $routeParams, $http) {
        $scope.submit = function () {
            $http({
                method: "POST",
                url: "http://localhost:3000/login",
                data: { username: $scope.username, password: $scope.password }
            }).then(function success(response) {
                if (response.data == "user or password does not exists") {

                }
                // else if(response.data is error)
                else {
                    console.log(response);//
                    var token = response;
                }
            }, function erro(response) {
                $scope._error = response;
            });
        };

    });