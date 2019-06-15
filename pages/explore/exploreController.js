

angular.module("myApp")
    .controller('exploreController', function ($scope, $routeParams, $http, $rootScope) {
        console.log("hereerer");
        // $http({
        //     method: "GET",
        //     url: "http://localhost:3000/getAllCategories"
        // }).then(function success(response) {
        //     $scope._categories = response.data;
        // }, function erro(response) {
        //     console.log("error");
        // });
        // $http({
        //     method: "GET",
        //     url: "http://localhost:3000/getAllPOI"
        // }).then(function success(response) {
        //     allPOIs = response.data;
        //     show(allPOIs);
        // }, function erro(response) {
        //     console.log("error");
        // });
        // $rootScope.$on('InfoReceived',function(){
        //     show($rootScope._allPOIs);
        // });
        // Promise.all([$rootScope.p1,$rootScope.p2]).then(function(values){
        //     show($rootScope._allPOIs);
        // });
        if($rootScope._allPOIs && $rootScope._categories)
            show($rootScope._allPOIs);

        $scope.search = function () {
            show($rootScope._allPOIs.filter(poi=>poi.name.toLowerCase().includes(($scope.entry?$scope.entry:"").toLowerCase())));
        }


        function show(data) {
            console.log('data:', data)
            $scope._error = undefined;
            POIs = {};
            console.log($rootScope._categories);
            for (var _category of $rootScope._categories) {
                var temp = [];
                for (var poi of data) {
                    if (poi.category_name == _category) {
                        temp.push(poi);
                    }
                }
                if(temp.length>0)
                    POIs[_category] = temp;
            }
            $scope.pois = POIs;
            if(Object.keys(POIs).length==0)
            {
                $scope._error = "No POI with that entry founded";
            }
        }
    })