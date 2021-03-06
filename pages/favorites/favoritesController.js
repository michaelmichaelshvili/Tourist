// var $s;
app
    .controller('favoritesController', function ($window, $scope, $routeParams, $http, $rootScope) {
        // $scope.models = {
        //     lists: {
        //         "pois": $rootScope.LocalFavorites
        //     }
        // };
        $scope.list = $rootScope.LocalFavorites;
        $scope.save_favorites_in_server = function(){
            $http({
                // headers: { "x-auth-token": $window.localStorage.getItem('token')}, 
                method: "POST",
                url: "http://localhost:3000/private/saveAsFavorites",
                data: { pois:  $rootScope.LocalFavorites.map(x=>x.name)},
                headers: { "x-auth-token": $window.localStorage.getItem('token')}
            }).then(function success(response) {
            }, function erro(response) {
                $scope._error = response;
            });
        };


        $scope.sort_categories_by_Az = function () {
            $rootScope.LocalFavorites = $rootScope.LocalFavorites.sort((a,b)=>{
                return (a.category_name.localeCompare(b.category_name))!=0?(a.category_name.localeCompare(b.category_name)):(a.name.localeCompare(b.name));
            });
        }
        $scope.sort_categories_by_rank = function () {
            $rootScope.LocalFavorites = $rootScope.LocalFavorites.sort((a,b)=>{
                return (b.rate - a.rate);
            });
        }



        $scope.removeFromList = function (list, index) {
            list.splice(index, 1);
        }

        // $scope.list = $scope.models.lists.A;

        // Model to JSON for demo purpose
        // $scope.$watch('models', function (model) {
        //     $scope.modelAsJson = angular.toJson(model, true);
        // }, true);

    });
