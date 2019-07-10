angular.module("Jerusalem Advisor")
    .controller('loginController', function ($window, $scope, $http, $location,sharedProperties,$rootScope) {
        

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
                if (response.data == "User or password does not exists") {
                    alert(response.data);
                }   
                // else if(response.data is error)
                else {
                    // console.log(response.data);
                    $window.localStorage.setItem('token',response.data);
                    // sharedProperties.logUser($scope.username);
                    $rootScope.logUser($scope.username);

                    $http.get("http://localhost:3000/private/getFavoritePOI",{headers:{"x-auth-token":response.data}})
                    .then(function(response){
                        $rootScope.LocalFavorites=response.data.sort((a,b)=>a.rank-b.rank);
                    });
                    
                    // .then(function(response){$rootScope.LocalFavorites=response.data.map(x=>x.name);});
                    //broadcast login
                    // var token = response.data;
                    $location.path('/');// TODO: to comeback to where you came from? through route param
                }
            }, function erro(response) {
                $scope._error = response;
            });
        };

    });