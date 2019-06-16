

var jsonContries;
var xml2json = new XMLtoJSON();
xml2json.fromFile("countries.xml", function (json) {
    jsonContries = json;
});
var questions = [
    { qid: 1, name: "who are you?" },
    { qid: 2, name: "what's your nickname?" },
    { qid: 3, name: "What's your dream job?" }
];
var questionNum = 1;

angular.module("myApp")
    .controller("registerController", function ($scope, $http, $timeout, $location, $compile) {
        $scope.answers = undefined;
        // $scope._categories = undefined;

        $scope.doSomething = function () {
            $timeout(function () {
                var myDrop = new drop({ selector: '.MultiSelect' });
            }, 0);
        }

        $scope.submit = function () {
            document.getElementById("categories");
            sopt = [];
            for (i of document.getElementById("register_categories").options)
                if (i && i.selected == true)
                    sopt.push(i.value);
            //at least 2
            console.log(sopt);
            $location.path("/");
            //TODO: add post request with bdikot
        }

        $scope.possibleQuestion = questions;

        $scope.addField = function ($event) {
            var Element = document.getElementById(`question${questionNum++}`);
            // var newElement = angular.element(`<div id="question${questionNum}"></div>`);
            var newElement = angular.element(`<div id="question${questionNum}"><select ng-required="required">
                <option disabled selected value> -- select a question -- </option>
                <option value="{{ques.name}}" ng-repeat="ques in possibleQuestion">{{ques.name}}</option>
                <input  type="text" placeholder="your answer">
                </select></div>`);
            $compile(newElement.contents())($scope);
            Element.parentNode.insertBefore(newElement[0], Element.nextSibling);

            // Element.append(newElement);
            $event.preventDefault();
        }
        // $http({
        //     method: "GET",
        //     url: "http://localhost:3000/getAllCategories"
        // }).then(function success(response) {
        //     $scope._categories = response.data;
        // }, function erro(response) {
        //     console.log("error");
        // });

        // Ob($scope._categories, function (valu) {
        //     console.log(1);
        // var myDrop = new drop({
        //     selector: '.MultiSelect'
        // });
        // myDrop.toggle();
        // });

        // this.jsonContries = jsonContries;
        // this.selectedCountryId = 0;
        $scope._jsonContries = jsonContries;
        $scope._selectedCountry = undefined;

        // $scope.submit = function(){
        //     // $scope.answer = "Submitted! you entered: " + $scope.uname
        // };
    });

