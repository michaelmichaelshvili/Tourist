angular.module("myApp")
    .controller('loginController', function ($window, $scope, $http, $location,sharedProperties,$rootScope) {
        $scope.username = 'er';
        $scope.password = 'er';

        $scope.forgot_password = function(){
            // console.log("check check 1 2");
            if($scope.username)
                $location.url(`/forgotPassword/${$scope.username}`);
            else
                $location.url(`/forgotPassword`);

        }

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
                    // console.log(response.data);
                    $window.localStorage.setItem('token', response.data);
                    // sharedProperties.logUser($scope.username);
                    $rootScope.logUser($scope.username);

                    $http.get("http://localhost:3000/private/getFavoritePOI",{headers:{"x-auth-token":response.data}})
                    .then(function(response){$rootScope.LocalFavorites=response.data.map(x=>x.name);});
                    //broadcast login
                    // var token = response.data;
                    $location.path('/');// TODO: to comeback to where you came from? through route param
                }
            }, function erro(response) {
                $scope._error = response;
            });
        };

    });