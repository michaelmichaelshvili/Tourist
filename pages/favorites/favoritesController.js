// var $s;
app
    .controller('favoritesController', function ($scope, $routeParams, $http, $rootScope) {
        console.log("log");
        $scope.models = {
            lists: {
                "pois": $rootScope.LocalFavorites
            }
        };

        $scope.removeFromList = function (list, index) {
            list.splice(index, 1);
        }

        // $scope.list = $scope.models.lists.A;

        // Model to JSON for demo purpose
        // $scope.$watch('models', function (model) {
        //     $scope.modelAsJson = angular.toJson(model, true);
        // }, true);

    });
