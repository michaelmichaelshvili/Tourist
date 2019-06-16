

angular.module("myApp")
    .controller('exploreController', function ($scope, $routeParams, $http, $rootScope) {

        
        if ($rootScope._allPOIs && $rootScope._categories){
            $scope.select_categories = {}
            for(_category of $rootScope._categories)
                $scope.select_categories[_category]=true;
            show($rootScope._allPOIs);
        }

        $scope.apply_categories = function () {
            var ses = [];
            for (k in $scope.select_categories) { if ($scope.select_categories[k]) { ses.push(k) } }
            show($rootScope._allPOIs.filter(poi => poi.name.toLowerCase().includes(($scope.entry ? $scope.entry : "").toLowerCase())),ses);
        }

        $scope.search = function () {
            show($rootScope._allPOIs.filter(poi => poi.name.toLowerCase().includes(($scope.entry ? $scope.entry : "").toLowerCase())));
        }

        $scope.showSorted = function () {
            show($rootScope._allPOIs.filter(poi => poi.name.toLowerCase().includes(($scope.entry ? $scope.entry : "").toLowerCase()))
                .sort(function(a,b){return b.rate-a.rate;}));
        }


        function show(data,categories) {
            // console.log('data:', data)
            $scope._error = undefined;
            var POIs = {};
            // console.log($rootScope._categories);
            categories = categories?categories:$rootScope._categories;
            for (var _category of categories) {
                var temp = [];
                for (var poi of data) {
                    if (poi.category_name == _category) {
                        temp.push(poi);
                    }
                }
                if (temp.length > 0)
                    POIs[_category] = temp;
            }
            $scope.pois = POIs;
            if (Object.keys(POIs).length == 0) {
                $scope._error = "No POI with that entry founded";
            }
        }
    })